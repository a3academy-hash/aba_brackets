"""Extract the ABA championship schedule from the source PDF and emit a typed
JSON file at lib/schedule/games.json.

Run:  python scripts/extract-schedule.py

The PDF/CSV in data/ are the source of truth. This script is the only thing
that should read them; the Next.js app loads games.json. Re-run this script
whenever the source schedule changes, then commit the regenerated JSON.

Color legend in PDF:
  Premier  = light blue (~RGB 207,226,243)
  Prospect = light red  (~RGB 244,204,204)
  Varsity  = light yellow(~RGB 255,229,153)

Notes:
  * "KINGS" (Varsity) and "Kingsmen" (Prospect) are DISTINCT teams from the
    same organization. DO NOT normalize. They flow through verbatim.
  * The Premier Friday cells say "(10am)" / "(1am)" inline — clear typos for
    1pm. The override is applied via lib/scheduleOverrides.ts at render time;
    this importer emits the raw cell time so the source-of-truth chain stays
    intact.
  * The Friday Varsity cells contain the literal text "Prospect Championship"
    (PDF copy-paste typo). The override file relabels them at render time;
    this importer emits the raw text and tags the games as bracket=FINAL/IF.
"""
import fitz
import json
import re
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PDF = ROOT / "data" / "schedule.pdf"
OUT = ROOT / "lib" / "schedule" / "games.json"

# Tournament dates — the PDF only shows weekday names; map to absolute dates.
DAY_TO_DATE = {
    "Tuesday":   "2026-05-12",
    "Wednesday": "2026-05-13",
    "Thursday":  "2026-05-14",
    "Friday":    "2026-05-15",
}

ZOOM = 4.0  # render scale for color sampling


def classify_color(rgb):
    r, g, b = rgb
    if max(r, g, b) < 180:
        return "header"
    if r > 248 and g > 248 and b > 248:
        return "white"
    if r > 240 and g > 200 and b < 200:
        return "varsity"
    if r > 230 and abs(g - b) < 15 and r - g > 25:
        return "prospect"
    if b > r and b > g and b > 200:
        return "premier"
    return "white"


def extract_spans():
    """Return list of {text, bbox, division} for every text span in the PDF."""
    doc = fitz.open(PDF)
    page = doc[0]
    pix = page.get_pixmap(matrix=fitz.Matrix(ZOOM, ZOOM), alpha=False)
    W, H, samples, stride = pix.width, pix.height, pix.samples, pix.stride

    def pixel(px, py):
        px = max(0, min(W - 1, int(px)))
        py = max(0, min(H - 1, int(py)))
        o = py * stride + px * 3
        return (samples[o], samples[o + 1], samples[o + 2])

    spans = []
    for block in page.get_text("dict")["blocks"]:
        for line in block.get("lines", []):
            for span in line.get("spans", []):
                t = span["text"].strip()
                if not t:
                    continue
                spans.append({"text": t, "bbox": span["bbox"]})

    for s in spans:
        bb = s["bbox"]
        cx = (bb[0] + bb[2]) / 2 * ZOOM
        cy = (bb[1] + bb[3]) / 2 * ZOOM
        # sample around the bbox edges, avoiding the dark glyphs themselves
        candidates = []
        for dx in (-12, 12, 0):
            for dy in (-10, 10):
                r, g, b = pixel(cx + dx, cy + dy)
                if r < 80 and g < 80 and b < 80:
                    continue
                candidates.append((r, g, b))
        if not candidates:
            s["division"] = "white"
        else:
            mode = Counter(candidates).most_common(1)[0][0]
            s["division"] = classify_color(mode)
    return spans


def index_axes(spans):
    """Build (day_for_y, time_for_y, field_for_x) lookups from header cells."""
    day_rows = {}    # y -> day name
    time_rows = {}   # y -> time string
    field_cols = {}  # x_center -> field number

    for s in spans:
        t = s["text"]
        bb = s["bbox"]
        y = round(bb[1], 1)
        xc = (bb[0] + bb[2]) / 2
        if t in DAY_TO_DATE and bb[0] < 70:
            day_rows[y] = t
        elif re.match(r"^\d{1,2}:\d{2}\s?(AM|PM)$", t) and bb[0] < 70:
            time_rows[y] = t
        elif t.startswith("Field "):
            field_cols[xc] = t

    sorted_days = sorted(day_rows.items())

    def day_for_y(y):
        cur = None
        for dy, name in sorted_days:
            if dy <= y:
                cur = name
        return cur

    sorted_fields = sorted(field_cols.items())

    def field_for_x(x):
        return min(sorted_fields, key=lambda fc: abs(fc[0] - x))[1]

    def time_for_y(y):
        # find largest time-row y <= y, within ~12 px
        best = None
        for ty in sorted(time_rows):
            if ty <= y + 1 and y - ty < 12:
                best = ty
        return time_rows[best] if best is not None else None

    return day_for_y, time_for_y, field_for_x


REF_PAT = re.compile(r"^([WL])(\d+)$")


def parse_ref(token, division):
    """Parse a side of a matchup into a SlotRef dict.

    Token forms:
      "WSA"  -> team
      "W3"   -> winnerOf game 3 in this division
      "L7"   -> loserOf game 7 in this division
    """
    token = token.strip()
    m = REF_PAT.match(token)
    if m:
        kind = "winnerOf" if m.group(1) == "W" else "loserOf"
        n = int(m.group(2))
        return {"kind": kind, "gameId": f"{division}.g{n}"}
    return {"kind": "team", "teamId": f"{division}.{token}"}


# Tolerates "-- G3" and "  G5" (the source has both forms — the latter is a typo)
TRAILING_GAMENUM = re.compile(r"\s+--\s+G(\d+)\s*$|\s+G(\d+)\s*$")


def parse_matchup(text, division):
    """Parse a cell text like 'WB: P27 @ DSC -- G3' into a structured dict."""
    s = text.strip()

    # Championship rows
    if s.startswith("IF") and ("Championship" in s or "Champ" in s):
        return {"bracket": "IF", "gameNumber": None, "away": None, "home": None}
    if "Championship" in s:
        return {"bracket": "FINAL", "gameNumber": None, "away": None, "home": None}

    # Strip trailing parenthetical (e.g. " (10am)")
    s = re.sub(r"\s*\([^)]*\)\s*$", "", s).strip()

    # Pull off trailing game number
    gnum = None
    m = TRAILING_GAMENUM.search(s)
    if m:
        gnum = int(m.group(1) or m.group(2))
        s = s[: m.start()].strip()

    # Bracket prefix; tolerate missing colon ("WB W2 vs W3")
    bracket = "POOL"
    if re.match(r"^WB[:\s]", s):
        bracket = "WB"
        s = re.sub(r"^WB[:\s]+", "", s).strip()
    elif re.match(r"^LB[:\s]", s):
        bracket = "LB"
        s = re.sub(r"^LB[:\s]+", "", s).strip()

    # Split into two sides on " @ " or " vs "
    parts = re.split(r"\s+(?:@|vs)\s+", s, flags=re.IGNORECASE)
    if len(parts) != 2:
        return None
    away_token, home_token = parts[0].strip(), parts[1].strip()

    return {
        "bracket": bracket,
        "gameNumber": gnum,
        "away": parse_ref(away_token, division),
        "home": parse_ref(home_token, division),
    }


def main():
    spans = extract_spans()
    day_for_y, time_for_y, field_for_x = index_axes(spans)

    games = []
    for s in spans:
        div = s["division"]
        if div not in ("premier", "prospect", "varsity"):
            continue
        bb = s["bbox"]
        y = round(bb[1], 1)
        time = time_for_y(y)
        if time is None:
            continue  # footer label cells ("Premier", "Prospect", "Varsity")
        day = day_for_y(y)
        field = field_for_x((bb[0] + bb[2]) / 2)

        parsed = parse_matchup(s["text"], div)
        if parsed is None:
            print(f"WARN: unparseable cell in {div}: {s['text']!r}")
            continue

        if parsed["bracket"] == "FINAL":
            gid = f"{div}.fin"
        elif parsed["bracket"] == "IF":
            gid = f"{div}.if"
        else:
            gid = f"{div}.g{parsed['gameNumber']}"

        # Championship-game slot refs derived from bracket structure:
        #   Premier  FIN/IF: winnerOf(g9)  vs winnerOf(g11)
        #   Prospect FIN/IF: winnerOf(g15) vs winnerOf(g17)
        #   Varsity  FIN/IF: winnerOf(g15) vs winnerOf(g17)
        if parsed["bracket"] in ("FINAL", "IF"):
            wb_final = 9 if div == "premier" else 15
            lb_final = 11 if div == "premier" else 17
            parsed["away"] = {"kind": "winnerOf", "gameId": f"{div}.g{wb_final}"}
            parsed["home"] = {"kind": "winnerOf", "gameId": f"{div}.g{lb_final}"}

        game = {
            "id": gid,
            "division": div,
            "bracket": parsed["bracket"],
            "gameNumber": parsed["gameNumber"],
            "date": DAY_TO_DATE[day],
            "time": time,
            "field": field,
            "away": parsed["away"],
            "home": parsed["home"],
        }
        if parsed["bracket"] == "FINAL":
            game["ifGameId"] = f"{div}.if"
        games.append(game)

    # Sort: division order, then game number (FIN=9999, IF=10000)
    div_order = {"premier": 0, "prospect": 1, "varsity": 2}
    def sort_key(g):
        if g["bracket"] == "FINAL":
            n = 9999
        elif g["bracket"] == "IF":
            n = 10000
        else:
            n = g["gameNumber"] or 0
        return (div_order[g["division"]], n)
    games.sort(key=sort_key)

    by_div = Counter(g["division"] for g in games)
    print(f"Extracted: {dict(by_div)}  total={sum(by_div.values())}")
    expected = {"premier": 13, "prospect": 19, "varsity": 19}
    if dict(by_div) != expected:
        raise SystemExit(f"FAIL: expected {expected}, got {dict(by_div)}")

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(games, indent=2) + "\n", encoding="utf-8")
    print(f"Wrote {OUT.relative_to(ROOT)} ({len(games)} games)")


if __name__ == "__main__":
    main()
