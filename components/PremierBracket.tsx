import { GameCard } from './GameCard';
import { GAMES_BY_ID } from '@/lib/schedule';
import type { DivisionState, Game, GameId, SlotRef, TeamId } from '@/lib/types';

/**
 * Premier (7-team double-elimination) bracket. Hand-tuned absolute layout
 * that mirrors `docs/7-team-double-elimination-bracket.png`:
 *
 *   Winner's Bracket on top (P27 bye row + 3 pool games of 2 teams each).
 *   Loser's Bracket on bottom (5 WB-loser ghosts + L9 ghost from WB Final).
 *   FINAL centered between WB Final and LB Final.
 *   IF directly below FINAL with a dashed vertical connector.
 *
 * Coordinates are in ROW units (1 row = ROW_H px) along y, COL units along x.
 * Connectors land on the appropriate slot row of each destination card —
 * the away feeder enters at the top half, the home feeder at the bottom half.
 */

// ── geometry ──────────────────────────────────────────────────────────────────

const ROW_H = 100;         // vertical unit
const CARD_W = 150;
const CARD_H = 96;         // header (22) + two ~36px team rows + 1px separator
const COL_GAP = 30;
const COL_STRIDE = CARD_W + COL_GAP;
const PADDING_LEFT = 110;  // leaves room for the bye / section labels
const PADDING_RIGHT = 24;
const PADDING_TOP = 56;
const PADDING_BOTTOM = 32;
const HEADER_H = 22;       // height of the navy header bar inside GameCard

const xForCol = (col: number) => col * COL_STRIDE + PADDING_LEFT;
const yForRow = (row: number) => row * ROW_H + PADDING_TOP;
const cardLeftX = (col: number) => xForCol(col);
const cardRightX = (col: number) => xForCol(col) + CARD_W;
const cardTopY = (row: number) => yForRow(row) - CARD_H / 2;
const cardCenterY = (row: number) => yForRow(row);
const cardSlotY = (row: number, side: 'away' | 'home') => {
  // Below the card header, two team rows split the remaining height equally.
  const slotHeight = (CARD_H - HEADER_H) / 2;
  const top = cardTopY(row) + HEADER_H;
  return side === 'away' ? top + slotHeight / 2 : top + slotHeight + slotHeight / 2;
};

// ── layout: one entry per game ────────────────────────────────────────────────

type Layout = { col: number; row: number };

const POSITIONS: Partial<Record<GameId, Layout>> = {
  // WB section (rows 0–8)
  'premier.g1':  { col: 0, row: 1.5 },     // WSA vs A3
  'premier.g2':  { col: 0, row: 4.5 },     // ECA vs TNXL
  'premier.g3':  { col: 0, row: 7.5 },     // PDG vs GPA
  'premier.g4':  { col: 1, row: 0.75 },    // P27 (bye) + W1
  'premier.g5':  { col: 1, row: 6 },       // W2 + W3
  'premier.g9':  { col: 2, row: 3.375 },   // W4 + W5  — WB Final
  // LB section (rows 11–17)
  'premier.g6':  { col: 1, row: 14.5 },    // L2 + L3       — LB R1
  'premier.g7':  { col: 2, row: 11.5 },    // L1 + L5       — LB R2
  'premier.g8':  { col: 2, row: 13.75 },   // L4 + W6       — LB R2
  'premier.g10': { col: 3, row: 12.625 },  // W7 + W8       — LB R3
  'premier.g11': { col: 4, row: 14.3125 }, // W10 + L9      — LB Final
  // Championship
  'premier.fin': { col: 5, row: 8.84 },    // W9 + W11
  'premier.if':  { col: 5, row: 11 },      // dashed; rematch
};

// Bye team that doesn't play in WB R1 — rendered as a small label at the very
// top of WB with a step connector into G4's away slot.
const BYE = {
  team: 'P27' as TeamId,
  col: 0,
  row: 0,
  toGameId: 'premier.g4' as GameId,
};

const BYE_W = 70;
const BYE_H = 26;

// Round-label rail entries (column → label)
const ROUND_LABELS: { col: number; label: string }[] = [
  { col: 0, label: 'Pool' },
  { col: 1, label: 'WB R1' },
  { col: 2, label: 'WB Final' },
  { col: 5, label: 'Championship' },
];

const LB_ROUND_LABELS: { col: number; label: string }[] = [
  { col: 1, label: 'LB R1' },
  { col: 2, label: 'LB R2' },
  { col: 3, label: 'LB R3' },
  { col: 4, label: 'LB Final' },
];

// ── component ─────────────────────────────────────────────────────────────────

type Props = { state: DivisionState; admin?: boolean };

export function PremierBracket({ state, admin = false }: Props) {
  const TOTAL_W = cardRightX(5) + PADDING_RIGHT;
  const TOTAL_H = yForRow(17) + PADDING_BOTTOM;

  const finResult = state.results['premier.fin'];
  const finWinner = finResult?.winner ?? null;
  const wbFinalResult = state.results['premier.g9'];
  const wbSideWonFin = !!(finWinner && wbFinalResult?.winner === finWinner);
  const lbSideWonFin = !!(finWinner && !wbSideWonFin);

  return (
    <div className="overflow-x-auto overflow-y-visible">
      <div className="relative" style={{ width: TOTAL_W, height: TOTAL_H }}>
        {/* Section banners */}
        <SectionBanner label="Winner's Bracket" top={6} />
        <SectionBanner label="Loser's Bracket" top={yForRow(10) - 8} />

        {/* Round labels — top rail */}
        {ROUND_LABELS.map((l) => (
          <RailLabel key={`wb-${l.col}`} col={l.col} top={32} label={l.label} />
        ))}
        {/* Round labels — between WB and LB */}
        {LB_ROUND_LABELS.map((l) => (
          <RailLabel key={`lb-${l.col}`} col={l.col} top={yForRow(10) + 14} label={l.label} subtle />
        ))}

        {/* Connectors */}
        <svg className="absolute pointer-events-none" width={TOTAL_W} height={TOTAL_H} style={{ left: 0, top: 0 }}>
          <ByeConnector />
          {Object.entries(POSITIONS).map(([gid]) =>
            renderGameConnectors(gid as GameId, lbSideWonFin, wbSideWonFin),
          )}
        </svg>

        {/* Bye pill */}
        <div
          className="absolute rounded border border-navy/40 bg-white text-[12px] font-semibold text-navy flex items-center justify-center"
          style={{
            left: xForCol(BYE.col) - BYE_W - 12,
            top: yForRow(BYE.row) - BYE_H / 2,
            width: BYE_W,
            height: BYE_H,
          }}
          title="Bye — advances directly to WB R1"
        >
          {BYE.team}
        </div>

        {/* Game cards */}
        {Object.entries(POSITIONS).map(([gid, pos]) => {
          if (!pos) return null;
          const game = GAMES_BY_ID[gid as GameId];
          if (!game) return null;
          const isIfDimmed = gid === 'premier.if' && wbSideWonFin;
          return (
            <div
              key={gid}
              className="absolute"
              style={{
                left: cardLeftX(pos.col),
                top: cardTopY(pos.row),
                width: CARD_W,
                height: CARD_H,
              }}
            >
              <GameCard game={game} results={state.results} admin={admin} dimmed={isIfDimmed} />
            </div>
          );
        })}

        {/* IF status text */}
        <IfStatus
          wbSideWonFin={wbSideWonFin}
          lbSideWonFin={lbSideWonFin}
        />
      </div>
    </div>
  );
}

// ── connectors ────────────────────────────────────────────────────────────────

function renderGameConnectors(
  gameId: GameId,
  lbSideWonFin: boolean,
  wbSideWonFin: boolean,
): React.ReactNode {
  const pos = POSITIONS[gameId];
  if (!pos) return null;
  const game = GAMES_BY_ID[gameId];
  if (!game) return null;

  // IF gets a vertical dashed/solid connector from FIN — drawn separately
  if (gameId === 'premier.if') {
    const finPos = POSITIONS['premier.fin']!;
    const xLine = cardLeftX(finPos.col) + CARD_W / 2;
    const yFinBottom = cardTopY(finPos.row) + CARD_H;
    const yIfTop = cardTopY(pos.row);
    const stroke = lbSideWonFin ? '#C8102E' : '#0A2240';
    return (
      <line
        key="if-connector"
        x1={xLine}
        y1={yFinBottom}
        x2={xLine}
        y2={yIfTop}
        stroke={stroke}
        strokeWidth={lbSideWonFin ? 2.5 : 1.5}
        strokeDasharray={lbSideWonFin ? undefined : '5 4'}
        opacity={wbSideWonFin ? 0.35 : 0.95}
      />
    );
  }

  const lines: React.ReactNode[] = [];
  const slots: { slot: SlotRef; side: 'away' | 'home' }[] = [
    { slot: game.away, side: 'away' },
    { slot: game.home, side: 'home' },
  ];

  for (const { slot, side } of slots) {
    if (slot.kind === 'team') continue;            // bye / pool teams handled inline or via ByeConnector
    if (slot.kind === 'loserOf' && game.bracket !== 'FINAL') continue; // LB ghost feeders shown as inline placeholder text

    const refPos = POSITIONS[slot.gameId];
    if (!refPos) continue;

    const x1 = cardRightX(refPos.col);
    const y1 = cardCenterY(refPos.row);
    const x2 = cardLeftX(pos.col);
    const y2 = cardSlotY(pos.row, side);
    const midX = (x1 + x2) / 2;

    lines.push(
      <path
        key={`${gameId}-${side}`}
        d={`M ${x1} ${y1} H ${midX} V ${y2} H ${x2}`}
        fill="none"
        stroke="#0A2240"
        strokeWidth={1.5}
        opacity={0.75}
      />,
    );
  }
  return <g key={`g-${gameId}`}>{lines}</g>;
}

function ByeConnector() {
  const x1 = xForCol(BYE.col) - 12;
  const y1 = yForRow(BYE.row);
  const toPos = POSITIONS[BYE.toGameId]!;
  const x2 = cardLeftX(toPos.col);
  const y2 = cardSlotY(toPos.row, 'away');
  const midX = (x1 + x2) / 2;
  return (
    <path
      d={`M ${x1} ${y1} H ${midX} V ${y2} H ${x2}`}
      fill="none"
      stroke="#0A2240"
      strokeWidth={1.5}
      opacity={0.75}
    />
  );
}

// ── sub-components ────────────────────────────────────────────────────────────

function SectionBanner({ label, top }: { label: string; top: number }) {
  return (
    <div
      className="absolute text-[11px] font-bold uppercase tracking-[0.15em] text-aba-red"
      style={{ left: 16, top }}
    >
      {label}
    </div>
  );
}

function RailLabel({
  col,
  top,
  label,
  subtle = false,
}: {
  col: number;
  top: number;
  label: string;
  subtle?: boolean;
}) {
  return (
    <div
      className={[
        'absolute text-[10px] font-semibold uppercase tracking-wider',
        subtle ? 'text-muted' : 'text-navy',
      ].join(' ')}
      style={{
        left: cardLeftX(col),
        top,
        width: CARD_W,
        textAlign: 'center',
      }}
    >
      {label}
    </div>
  );
}

function IfStatus({
  wbSideWonFin,
  lbSideWonFin,
}: {
  wbSideWonFin: boolean;
  lbSideWonFin: boolean;
}) {
  const finPos = POSITIONS['premier.fin']!;
  const ifPos = POSITIONS['premier.if']!;
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
  const midY = (cardTopY(finPos.row) + CARD_H + cardTopY(ifPos.row)) / 2;
  return (
    <div
      className={['absolute text-[9px] uppercase tracking-wider whitespace-nowrap', tone].join(' ')}
      style={{
        left: cardLeftX(finPos.col) + CARD_W / 2 + 8,
        top: midY - 6,
      }}
    >
      {label}
    </div>
  );
}
