import { GameCard } from './GameCard';
import { GAMES_BY_DIVISION, GAMES_BY_ID } from '@/lib/schedule';
import { gameRound } from '@/lib/bracket';
import {
  BYE_PILL_H,
  BYE_PILL_W,
  CARD_H,
  CARD_W_DESKTOP,
  CARD_W_MOBILE,
  COL_GAP,
  layoutDivision,
  type ByeLeaf,
  type Layout,
} from '@/lib/layout';
import type { Division, DivisionState, Game, GameId, TeamId } from '@/lib/types';

type Props = {
  division: Division;
  state: DivisionState;
  admin?: boolean;
};

const RAIL_H = 24;
const PADDING_X = 16;
const PADDING_TOP = 6;
const PADDING_BOTTOM = 24;
const RAILS_TOP_GAP = RAIL_H + 4;

export function PyramidBracket({ division, state, admin = false }: Props) {
  return (
    <>
      <div className="hidden lg:block">
        <PyramidCanvas division={division} state={state} admin={admin} cardWidth={CARD_W_DESKTOP} />
      </div>
      <div className="lg:hidden">
        <PyramidCanvas division={division} state={state} admin={admin} cardWidth={CARD_W_MOBILE} />
      </div>
    </>
  );
}

function PyramidCanvas({
  division,
  state,
  admin,
  cardWidth,
}: Props & { cardWidth: number }) {
  const layout = layoutDivision(division, { cardWidth });
  const games = GAMES_BY_DIVISION[division];

  const innerWidth = layout.width;
  // Left padding leaves room for the bye leaf pills which sit to the left of round 1
  const leftPad = PADDING_X + Math.max(0, BYE_PILL_W + 8);
  const totalWidth = leftPad + innerWidth + PADDING_X;
  const totalHeight = RAILS_TOP_GAP + layout.height + PADDING_BOTTOM;

  // Rail labels
  const wbLabels = computeWbLabels(games, layout);
  const lbLabels = computeLbLabels(games, layout);

  // Days per column (for the secondary tooltip-like info under each rail label)
  const daysByCol = computeDaysByColumn(games);

  // FIN state for IF connector + IF dim
  const finResult = state.results[layout.finId];
  const finWinner = finResult?.winner ?? null;
  const wbFinalGame = wbFinalGameForLayout(games);
  const wbFinalResult = wbFinalGame ? state.results[wbFinalGame.id] : undefined;
  const wbSideWonFin = !!(finWinner && wbFinalResult?.winner === finWinner);
  const lbSideWonFin = !!(finWinner && !wbSideWonFin);

  // y offsets — everything inside the canvas is shifted down by RAILS_TOP_GAP
  const yOffset = RAILS_TOP_GAP + PADDING_TOP;

  return (
    <div className="overflow-x-auto overflow-y-visible">
      <div className="relative" style={{ width: totalWidth, height: totalHeight }}>
        {/* WB top rail */}
        <RailLabels
          labels={wbLabels}
          days={daysByCol}
          cardWidth={cardWidth}
          leftPad={leftPad}
          y={0}
        />

        {/* LB rail (between sections) */}
        <RailLabels
          labels={lbLabels}
          days={daysByCol}
          cardWidth={cardWidth}
          leftPad={leftPad}
          y={layout.wbBottomY + RAILS_TOP_GAP + PADDING_TOP - 2}
          subtle
        />

        {/* Connectors */}
        <svg
          className="absolute pointer-events-none"
          width={totalWidth}
          height={totalHeight}
          style={{ left: 0, top: 0 }}
        >
          {games.map((g) => (
            <Connectors
              key={g.id}
              game={g}
              layout={layout}
              cardWidth={cardWidth}
              leftPad={leftPad}
              yOffset={yOffset}
              finId={layout.finId}
              ifId={layout.ifId}
              wbSideWonFin={wbSideWonFin}
              lbSideWonFin={lbSideWonFin}
            />
          ))}
          {/* Bye leaf-pill connectors */}
          {layout.byes.map((bye, i) => (
            <ByeConnector
              key={`bye-${i}`}
              bye={bye}
              cardWidth={cardWidth}
              leftPad={leftPad}
              yOffset={yOffset}
            />
          ))}
        </svg>

        {/* Bye pills */}
        {layout.byes.map((bye, i) => (
          <ByePill
            key={`pill-${i}`}
            bye={bye}
            leftPad={leftPad}
            yOffset={yOffset}
          />
        ))}

        {/* Game cards */}
        {games.map((g) => {
          const pos = layout.positions.get(g.id);
          if (!pos) return null;
          const isIfDimmed = g.id === layout.ifId && wbSideWonFin;
          return (
            <div
              key={g.id}
              className="absolute"
              style={{
                left: pos.x + leftPad,
                top: pos.y - CARD_H / 2 + yOffset,
                width: cardWidth,
                height: CARD_H,
              }}
            >
              <GameCard game={g} results={state.results} admin={admin} dimmed={isIfDimmed} />
            </div>
          );
        })}

        {/* IF status badge */}
        <IfBadge
          layout={layout}
          cardWidth={cardWidth}
          leftPad={leftPad}
          yOffset={yOffset}
          wbSideWonFin={wbSideWonFin}
          lbSideWonFin={lbSideWonFin}
        />
      </div>
    </div>
  );
}

// ── helpers ───────────────────────────────────────────────────────────────────

function computeWbLabels(games: readonly Game[], layout: Layout): Map<number, string> {
  const wbCols = Array.from(
    new Set(games.filter((g) => g.bracket === 'WB' || g.bracket === 'POOL').map((g) => gameRound(g.id))),
  ).sort((a, b) => a - b);
  const labels = new Map<number, string>();
  for (let i = 0; i < wbCols.length; i++) {
    const col = wbCols[i];
    if (col === layout.wbFinalRound) {
      labels.set(col, 'WB Final');
    } else if (i === 0) {
      labels.set(col, 'Pool');
    } else {
      labels.set(col, `WB R${i}`);
    }
  }
  // Championship column (always at finalRound)
  const finRound = layout.totalRounds - 1;
  labels.set(finRound, 'Championship');
  return labels;
}

function computeLbLabels(games: readonly Game[], layout: Layout): Map<number, string> {
  const lbCols = Array.from(
    new Set(games.filter((g) => g.bracket === 'LB').map((g) => gameRound(g.id))),
  ).sort((a, b) => a - b);
  const labels = new Map<number, string>();
  for (let i = 0; i < lbCols.length; i++) {
    const col = lbCols[i];
    if (col === layout.lbFinalRound) {
      labels.set(col, 'LB Final');
    } else {
      labels.set(col, `LB R${i + 1}`);
    }
  }
  return labels;
}

function computeDaysByColumn(games: readonly Game[]): Map<number, string> {
  const byCol = new Map<number, Set<string>>();
  for (const g of games) {
    if (g.bracket === 'IF') continue; // IF shares a column with FINAL
    const r = gameRound(g.id);
    let s = byCol.get(r);
    if (!s) {
      s = new Set();
      byCol.set(r, s);
    }
    s.add(formatShortDay(g.date));
  }
  const out = new Map<number, string>();
  for (const [col, set] of byCol) {
    const days = [...set].sort(byDayOrder);
    out.set(col, days.join('/'));
  }
  return out;
}

const DAY_ORDER = ['Tue', 'Wed', 'Thu', 'Fri'];
function byDayOrder(a: string, b: string): number {
  return DAY_ORDER.indexOf(a) - DAY_ORDER.indexOf(b);
}

function formatShortDay(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getUTCDay()];
}

function wbFinalGameForLayout(games: readonly Game[]): Game | undefined {
  const wb = games.filter((g) => g.bracket === 'WB' || g.bracket === 'POOL');
  if (wb.length === 0) return undefined;
  const maxRound = Math.max(...wb.map((g) => gameRound(g.id)));
  return wb.find((g) => gameRound(g.id) === maxRound);
}

// ── components ────────────────────────────────────────────────────────────────

function RailLabels({
  labels,
  days,
  cardWidth,
  leftPad,
  y,
  subtle = false,
}: {
  labels: Map<number, string>;
  days: Map<number, string>;
  cardWidth: number;
  leftPad: number;
  y: number;
  subtle?: boolean;
}) {
  const colStride = cardWidth + COL_GAP;
  return (
    <div
      className={['absolute left-0 right-0 pointer-events-none', subtle ? 'opacity-90' : ''].join(' ')}
      style={{ top: y, height: RAIL_H }}
    >
      {[...labels.entries()].map(([round, label]) => {
        const day = days.get(round) ?? '';
        return (
          <div
            key={round}
            className="absolute text-[10px] font-bold uppercase tracking-wider text-navy"
            style={{
              left: round * colStride + leftPad,
              width: cardWidth,
              textAlign: 'center',
            }}
          >
            <div>{label}</div>
            {day ? <div className="text-[9px] font-normal text-muted">{day}</div> : null}
          </div>
        );
      })}
    </div>
  );
}

function ByePill({
  bye,
  leftPad,
  yOffset,
}: {
  bye: ByeLeaf;
  leftPad: number;
  yOffset: number;
}) {
  const teamName = bye.team.split('.').slice(1).join('.');
  return (
    <div
      className="absolute rounded border border-navy/40 bg-white text-[11px] font-medium text-navy flex items-center justify-center px-1 truncate"
      style={{
        left: bye.x + leftPad,
        top: bye.y - BYE_PILL_H / 2 + yOffset,
        width: BYE_PILL_W,
        height: BYE_PILL_H,
      }}
      title="Bye — advances directly to next round"
    >
      {teamName}
    </div>
  );
}

function ByeConnector({
  bye,
  cardWidth,
  leftPad,
  yOffset,
}: {
  bye: ByeLeaf;
  cardWidth: number;
  leftPad: number;
  yOffset: number;
}) {
  const cardLeftX = bye.x + BYE_PILL_W + leftPad + 0;
  const pillRightX = bye.x + BYE_PILL_W + leftPad;
  // Card center y for the parent — we want to enter at the bye's slot row, not card center.
  // bye.y is already the row y center of the bye slot.
  const pillY = bye.y + yOffset;
  const cardX = bye.x + BYE_PILL_W + 8 + leftPad; // 8px after pill
  // Step-connector from pill to card slot row
  const targetX = cardX + (cardLeftX - cardX); // simplified — straight line ok
  return (
    <line
      x1={pillRightX}
      y1={pillY}
      x2={cardX + (cardLeftX - cardX)}
      y2={pillY}
      stroke="#0A2240"
      strokeWidth={1.5}
      opacity={0.6}
    />
  );
}

function Connectors({
  game,
  layout,
  cardWidth,
  leftPad,
  yOffset,
  finId,
  ifId,
  wbSideWonFin,
  lbSideWonFin,
}: {
  game: Game;
  layout: Layout;
  cardWidth: number;
  leftPad: number;
  yOffset: number;
  finId: GameId;
  ifId: GameId;
  wbSideWonFin: boolean;
  lbSideWonFin: boolean;
}) {
  const pos = layout.positions.get(game.id);
  if (!pos) return null;

  // IF connector (vertical, dashed when not active)
  if (game.id === ifId) {
    const finPos = layout.positions.get(finId);
    if (!finPos) return null;
    const xLine = finPos.x + cardWidth / 2 + leftPad;
    const yFinBottom = finPos.y + CARD_H / 2 + yOffset;
    const yIfTop = pos.y - CARD_H / 2 + yOffset;
    const stroke = lbSideWonFin ? '#C8102E' : '#0A2240';
    return (
      <line
        x1={xLine}
        y1={yFinBottom}
        x2={xLine}
        y2={yIfTop}
        stroke={stroke}
        strokeWidth={lbSideWonFin ? 2.5 : 1.5}
        strokeDasharray={lbSideWonFin ? undefined : '4 4'}
        opacity={wbSideWonFin ? 0.35 : 0.95}
      />
    );
  }

  // Default: step connectors from each feeder game's right edge to this game's left edge
  const lines: React.ReactNode[] = [];
  let i = 0;
  for (const slot of [game.away, game.home]) {
    if (slot.kind === 'team') {
      i++;
      continue;
    }
    const ref = GAMES_BY_ID[slot.gameId];
    if (!ref) {
      i++;
      continue;
    }
    const refPos = layout.positions.get(ref.id);
    if (!refPos) {
      i++;
      continue;
    }
    const isCrossBracket = slot.kind === 'loserOf';
    const drawForFinal = game.bracket === 'FINAL';
    if (isCrossBracket && !drawForFinal) {
      i++;
      continue;
    }

    const x1 = refPos.x + cardWidth + leftPad;
    const y1 = refPos.y + yOffset;
    const x2 = pos.x + leftPad;
    const y2 = pos.y + yOffset;
    const midX = (x1 + x2) / 2;

    lines.push(
      <path
        key={`${game.id}-${i}`}
        d={`M ${x1} ${y1} H ${midX} V ${y2} H ${x2}`}
        fill="none"
        stroke="#0A2240"
        strokeWidth={1.5}
        opacity={0.7}
      />,
    );
    i++;
  }
  return <>{lines}</>;
}

function IfBadge({
  layout,
  cardWidth,
  leftPad,
  yOffset,
  wbSideWonFin,
  lbSideWonFin,
}: {
  layout: Layout;
  cardWidth: number;
  leftPad: number;
  yOffset: number;
  wbSideWonFin: boolean;
  lbSideWonFin: boolean;
}) {
  const finPos = layout.positions.get(layout.finId);
  if (!finPos) return null;
  const label = lbSideWonFin
    ? 'Game 2 of Series'
    : wbSideWonFin
    ? 'Not needed'
    : 'If necessary';
  const tone = lbSideWonFin
    ? 'text-aba-red font-semibold'
    : wbSideWonFin
    ? 'text-muted/70 line-through'
    : 'text-muted';
  return (
    <div
      className={['absolute text-[9px] uppercase tracking-wider whitespace-nowrap', tone].join(' ')}
      style={{
        left: finPos.x + cardWidth / 2 + leftPad + 8,
        top: finPos.y + CARD_H / 2 + yOffset + 8,
      }}
    >
      {label}
    </div>
  );
}
