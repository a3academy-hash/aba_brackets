import { ALL_GAMES } from '@/lib/schedule';
import {
  gameDisplayTime,
  gameTitleLabel,
  resolveSlot,
  type ResolvedSlot,
} from '@/lib/resolve';
import type { Division, DivisionState, Game, GameId } from '@/lib/types';

type Props = {
  states: Record<Division, DivisionState>;
  /** Unused for now — grid is read-only. Plumbed through so admin/page can pass it. */
  admin?: boolean;
};

const FIELDS = ['Field 9', 'Field 10', 'Field 11', 'Field 12', 'Field 13', 'Field 14'] as const;
type FieldName = (typeof FIELDS)[number];

const TIME_ORDER: Record<string, number> = {
  '9:30 AM':  930,
  '11:00 AM': 1100,
  '12:15 PM': 1215,
  '1:00 PM':  1300,
  '3:00 PM':  1500,
};

type Row = {
  date: string;
  time: string;
  cells: Partial<Record<FieldName, Game>>;
};

function buildRows(games: readonly Game[]): Row[] {
  const map = new Map<string, Row>();
  for (const g of games) {
    if (!FIELDS.includes(g.field as FieldName)) continue;
    const key = `${g.date}|${g.time}`;
    let row = map.get(key);
    if (!row) {
      row = { date: g.date, time: g.time, cells: {} };
      map.set(key, row);
    }
    row.cells[g.field as FieldName] = g;
  }
  return [...map.values()].sort((a, b) => {
    if (a.date !== b.date) return a.date.localeCompare(b.date);
    return (TIME_ORDER[a.time] ?? 0) - (TIME_ORDER[b.time] ?? 0);
  });
}

function formatDay(iso: string): { weekday: string; mdy: string } {
  const [y, m, d] = iso.split('-').map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  const weekday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][
    date.getUTCDay()
  ];
  return { weekday, mdy: `${m}/${d}` };
}

export function ScheduleGrid({ states }: Props) {
  const rows = buildRows(ALL_GAMES);

  // Group consecutive rows by date so the day label spans multiple time rows.
  const dateGroups: { date: string; rows: Row[] }[] = [];
  for (const r of rows) {
    const last = dateGroups[dateGroups.length - 1];
    if (last && last.date === r.date) last.rows.push(r);
    else dateGroups.push({ date: r.date, rows: [r] });
  }

  return (
    <section className="w-full px-4 lg:px-6">
      <header className="mb-3">
        <h2 className="text-xl font-bold text-navy">Schedule Grid</h2>
        <p className="text-xs text-muted">All 51 games — Tuesday May 12 through Friday May 15.</p>
      </header>

      <div className="overflow-x-auto rounded-lg border border-navy/15 bg-white shadow-sm">
        <div
          role="table"
          className="min-w-[920px]"
          style={{
            display: 'grid',
            gridTemplateColumns: '120px 80px repeat(6, minmax(120px, 1fr))',
          }}
        >
          {/* Column headers */}
          <div role="rowgroup" className="contents">
            <div role="row" className="contents">
              <HeaderCell />
              <HeaderCell />
              {FIELDS.map((f) => (
                <HeaderCell key={f}>{f}</HeaderCell>
              ))}
            </div>
          </div>

          {/* Day blocks */}
          {dateGroups.map((grp) => {
            const { weekday, mdy } = formatDay(grp.date);
            return grp.rows.map((row, idx) => (
              <div role="row" key={`${row.date}-${row.time}`} className="contents">
                {idx === 0 ? (
                  <DayCell weekday={weekday} mdy={mdy} span={grp.rows.length} />
                ) : null}
                <TimeCell time={row.time} />
                {FIELDS.map((f) => {
                  const game = row.cells[f];
                  return (
                    <GridCell
                      key={f}
                      game={game ?? null}
                      state={game ? states[game.division] : null}
                      rowTime={row.time}
                    />
                  );
                })}
              </div>
            ));
          })}
        </div>
      </div>

      <Legend />
    </section>
  );
}

function HeaderCell({ children }: { children?: React.ReactNode }) {
  return (
    <div
      role="columnheader"
      className="border-b border-navy/15 bg-navy text-white text-[11px] font-semibold uppercase tracking-wider px-3 py-2 sticky top-0 z-10"
    >
      {children}
    </div>
  );
}

function DayCell({
  weekday,
  mdy,
  span,
}: {
  weekday: string;
  mdy: string;
  span: number;
}) {
  return (
    <div
      role="rowheader"
      className="border-b border-r border-navy/15 bg-navy/5 px-3 py-2 flex flex-col justify-center"
      style={{ gridRow: `span ${span}` }}
    >
      <div className="text-[13px] font-bold text-navy leading-tight">{weekday}</div>
      <div className="text-[11px] text-muted tabular-nums">{mdy}</div>
    </div>
  );
}

function TimeCell({ time }: { time: string }) {
  return (
    <div
      role="rowheader"
      className="border-b border-r border-navy/15 bg-white px-2 py-2 text-[11px] font-semibold text-navy tabular-nums flex items-center justify-end"
    >
      {time}
    </div>
  );
}

function GridCell({
  game,
  state,
  rowTime,
}: {
  game: Game | null;
  state: DivisionState | null;
  rowTime: string;
}) {
  if (!game || !state) {
    return <div className="border-b border-navy/10 bg-white" />;
  }

  const tint = DIVISION_TINT[game.division];
  const result = state.results[game.id];
  const away = resolveSlot(game.away, state.results);
  const home = resolveSlot(game.home, state.results);
  const title = gameTitleLabel(game);
  const titleShort = shortTitle(game, title);
  const displayTime = gameDisplayTime(game);
  const timeMoved = displayTime !== rowTime;

  return (
    <div className={`border-b border-l border-navy/10 ${tint.bg} px-2 py-1.5 min-h-[68px] flex flex-col gap-0.5`}>
      <div className="flex items-baseline justify-between gap-1">
        <span className={`text-[10px] font-bold uppercase tracking-wider ${tint.titleText}`}>
          {titleShort}
        </span>
        {timeMoved ? (
          <span className={`text-[9px] font-semibold tabular-nums ${tint.titleText} bg-white/60 rounded px-1`}>
            {displayTime}
          </span>
        ) : null}
      </div>
      <TeamLine slot={away} score={result?.awayScore ?? null} isWinner={!!(result?.winner && away.kind === 'team' && result.winner === away.teamId)} />
      <TeamLine slot={home} score={result?.homeScore ?? null} isWinner={!!(result?.winner && home.kind === 'team' && result.winner === home.teamId)} />
    </div>
  );
}

function TeamLine({
  slot,
  score,
  isWinner,
}: {
  slot: ResolvedSlot;
  score: number | null;
  isWinner: boolean;
}) {
  const text = slot.kind === 'team' ? slot.displayName : slot.label;
  return (
    <div className="flex items-baseline justify-between gap-1 leading-tight">
      <span
        className={[
          'truncate',
          slot.kind === 'placeholder'
            ? 'text-muted italic text-[10px]'
            : 'text-navy font-medium text-[12px]',
          isWinner ? 'font-bold text-emerald-600' : '',
        ].join(' ')}
      >
        {text}
      </span>
      <span
        className={[
          'tabular-nums shrink-0 text-[11px]',
          isWinner ? 'font-bold text-emerald-600' : 'text-muted',
        ].join(' ')}
      >
        {score ?? ''}
      </span>
    </div>
  );
}

function shortTitle(game: Game, fallback: string): string {
  if (game.bracket === 'FINAL') return fallback; // "Premier Championship" etc.
  if (game.bracket === 'IF') return fallback;
  return fallback.replace('Game ', 'G');
}

const DIVISION_TINT: Record<Division, { bg: string; titleText: string }> = {
  premier:  { bg: 'bg-premier-bg',  titleText: 'text-navy' },
  prospect: { bg: 'bg-prospect-bg', titleText: 'text-aba-red-dark' },
  varsity:  { bg: 'bg-varsity-bg',  titleText: 'text-navy' },
  jv:       { bg: 'bg-jv-bg',       titleText: 'text-navy' },
};

function Legend() {
  const items: { div: Division; label: string }[] = [
    { div: 'premier', label: 'Premier' },
    { div: 'prospect', label: 'Prospect' },
    { div: 'varsity', label: 'Varsity' },
    { div: 'jv', label: 'JV' },
  ];
  return (
    <div className="mt-3 flex items-center gap-4 text-[11px] text-muted">
      <span className="font-semibold uppercase tracking-wider">Legend</span>
      {items.map((it) => (
        <span key={it.div} className="flex items-center gap-1.5">
          <span
            className={`inline-block w-3 h-3 rounded-sm border border-navy/20 ${DIVISION_TINT[it.div].bg}`}
            aria-hidden
          />
          {it.label}
        </span>
      ))}
    </div>
  );
}
