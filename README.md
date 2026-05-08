# ABA National Championship — Brackets

Tournament bracket site for the ABA National Championship (May 12–15, 2026, Lakepoint Complex, Emerson, GA).

Three division brackets (Premier, Prospect, Varsity) rendered March Madness-style, with an admin route for live score / winner updates from a phone. State persists in Vercel KV (Upstash Redis) so updates are visible to all visitors immediately.

## Stack

- **Next.js 16** (App Router) + **React 19**
- **Tailwind CSS v4**
- **Vercel KV** (Upstash-powered) for state — accessed via `@upstash/redis`
- **Python + PyMuPDF** for the one-shot schedule importer

## Local development

```bash
npm install
cp .env.example .env.local        # then fill in ADMIN_PASSWORD (KV vars optional in dev)
npm run dev                       # http://localhost:3000
```

Without KV credentials the app falls back to an in-memory store — fine for testing, but state is lost on every server restart. Loud warning at boot.

To preview the production build locally:

```bash
npm run build
npm run start
```

### Required environment variables

| Var                   | Required             | Purpose |
|-----------------------|----------------------|---------|
| `ADMIN_PASSWORD`      | yes (for admin)      | Login password. Also derives the HMAC key for session cookies — changing it logs everyone out. |
| `KV_REST_API_URL`     | yes (in production)  | Set automatically when you connect Vercel KV. Read by `@upstash/redis`. |
| `KV_REST_API_TOKEN`   | yes (in production)  | Set automatically when you connect Vercel KV. |
| `UPSTASH_REDIS_REST_URL` | alternative          | Used if you're running Upstash directly without the Vercel KV integration. |
| `UPSTASH_REDIS_REST_TOKEN` | alternative      | Same. |

## Updating the schedule

The PDF/CSV in `data/` are the source of truth. The TS app loads `lib/schedule/games.json`, which is a build artifact generated from the PDF.

To re-export the schedule from a fresh CSV/PDF:

```bash
# 1. Replace data/schedule.pdf (or schedule.csv) with the new file.
# 2. Run the importer:
python scripts/extract-schedule.py
# 3. Eyeball lib/schedule/games.json, then commit.
```

The importer asserts the per-division game counts (Premier 13, Prospect 19, Varsity 19, total 51) and fails loudly if the structure changes. If a game's ID changes (e.g., the championship games are renamed), `lib/scheduleOverrides.ts` will fail at import time pointing to the stale override key.

### Source PDF typos

These corrections are applied at render time via `lib/scheduleOverrides.ts`. The source files in `data/` stay untouched so re-exporting from the original Google Sheet always reproduces the same JSON.

| Override            | Source PDF says                | We render                    |
|---------------------|--------------------------------|------------------------------|
| Varsity FIN label   | "Prospect Championship"         | "Varsity Championship"       |
| Varsity IF label    | "IF Prospect Championship"     | "IF Varsity Championship"    |
| Premier FIN time    | cell at 9:30 AM, inline "(10am)" | 10:00 AM                    |
| Premier IF time     | cell at 12:15 PM, inline "(1am)" | 1:00 PM (typo for 1pm)     |

## Admin

- `/admin/login` — password gate (uses `ADMIN_PASSWORD`)
- `/admin?d=premier` — same bracket UI as `/`, but each team row becomes a tap-to-advance button
- Each game card has an "Edit" disclosure with score inputs and a Reset button
- `/api/admin/logout` — clears the session cookie

The admin gate is implemented in `proxy.ts` (Next.js 16's renamed middleware). Server actions in `app/admin/actions.ts` re-check the cookie inline as defense in depth.

## Architecture notes

- **Static schedule, dynamic state.** Game IDs / dates / matchup edges ship in `lib/schedule/games.json`. KV holds only winners + scores per division, three keys total: `aba:state:premier`, `aba:state:prospect`, `aba:state:varsity`.
- **Lazy advancement.** A game's "Winner of G2" placeholder is resolved on every render by walking the slot ref. This means setting/clearing a result automatically propagates downstream — there's nothing to undo when the admin hits Reset.
- **`KINGS` and `Kingsmen` are different teams.** Same organization, different divisions (Varsity / Prospect). The importer passes the tokens through verbatim; do not normalize.

## Deploy to Vercel

1. Push this repo to GitHub: `https://github.com/a3academy-hash/aba_brackets.git`
2. Import the repo in the Vercel dashboard.
3. Add a **Vercel KV** store under Storage and connect it to the project — that auto-populates `KV_REST_API_URL` and `KV_REST_API_TOKEN`.
4. Add `ADMIN_PASSWORD` under Project Settings → Environment Variables (Production + Preview).
5. Deploy.

Public visits to `/` are revalidated every 60 seconds; admin POSTs explicitly call `revalidatePath('/')` so changes show up to visitors on the next request.

## Repository layout

```
app/
  page.tsx                    public bracket page (?d=premier|prospect|varsity)
  admin/page.tsx              admin bracket page (gated by proxy.ts)
  admin/login/page.tsx        login form (server action sets session cookie)
  admin/actions.ts            server actions: mark winner / update score / reset game
  api/admin/{result,reset,logout}/route.ts   programmatic API (also gated)
components/
  BracketView.tsx             one division as round columns
  GameCard.tsx                single game card (read-only or admin variant)
  DivisionTabs.tsx            sticky Premier / Prospect / Varsity tabs
  InfoPanel.tsx               sidebar (desktop) / accordion (mobile)
  SiteHeader.tsx              logo + title strip
lib/
  types.ts                    Division, GameId, TeamId, SlotRef, Game, GameResult
  schedule.ts                 typed loader for games.json with sanity assertions
  schedule/games.json         generated artifact — do not edit by hand
  scheduleOverrides.ts        render-time corrections + build-time assertion
  resolve.ts                  lazy SlotRef → display name resolution
  bracket.ts                  round numbering and column grouping
  kv.ts                       three-key state store (Upstash + dev fallback)
  auth.ts                     HMAC session cookie + password compare (Web Crypto)
proxy.ts                      gates /admin and /api/admin routes
data/
  schedule.pdf, schedule.csv  source of truth — do not edit
scripts/
  extract-schedule.py         PDF → games.json importer
public/
  aba-logo.png                navy crest used in the header
```
