import { GAMES_BY_DIVISION, GAMES_BY_ID } from './schedule';
import type { Division, Game, GameId } from './types';

const roundCache = new Map<GameId, number>();

/**
 * The "round" of a game is the longest dependency-chain length from a pool/team
 * leaf to that game. Pool/initial games are round 0; a game whose feeders are
 * all round 0 is round 1; and so on. Used to lay out the bracket in columns.
 */
export function gameRound(gameId: GameId): number {
  const cached = roundCache.get(gameId);
  if (cached !== undefined) return cached;
  const game = GAMES_BY_ID[gameId];
  if (!game) return 0;
  let max = 0;
  for (const slot of [game.away, game.home]) {
    if (slot.kind !== 'team') {
      max = Math.max(max, gameRound(slot.gameId) + 1);
    }
  }
  roundCache.set(gameId, max);
  return max;
}

export type RoundColumn = {
  round: number;
  /** Pool + WB games go in the upper rail */
  upper: Game[];
  /** LB games go in the lower rail */
  lower: Game[];
  /** FINAL + IF stand alone in the rightmost column */
  championship: Game[];
};

export function buildRoundColumns(division: Division): RoundColumn[] {
  const games = GAMES_BY_DIVISION[division];
  const cols = new Map<number, RoundColumn>();
  for (const g of games) {
    const r = gameRound(g.id);
    let col = cols.get(r);
    if (!col) {
      col = { round: r, upper: [], lower: [], championship: [] };
      cols.set(r, col);
    }
    if (g.bracket === 'FINAL' || g.bracket === 'IF') col.championship.push(g);
    else if (g.bracket === 'LB') col.lower.push(g);
    else col.upper.push(g);
  }
  // Within each column, sort by gameNumber so cards appear in numeric order
  const ordered: RoundColumn[] = [];
  const sorted = [...cols.values()].sort((a, b) => a.round - b.round);
  for (const col of sorted) {
    col.upper.sort(byGameNumber);
    col.lower.sort(byGameNumber);
    col.championship.sort((a, b) => (a.bracket === 'FINAL' ? 0 : 1) - (b.bracket === 'FINAL' ? 0 : 1));
    ordered.push(col);
  }
  return ordered;
}

function byGameNumber(a: Game, b: Game): number {
  return (a.gameNumber ?? 0) - (b.gameNumber ?? 0);
}

export function roundLabel(col: RoundColumn, totalRounds: number): string {
  if (col.championship.length > 0) return 'Championship';
  if (col.round === 0) {
    // could be pool or pure WB round 1 depending on division
    return 'Round 1';
  }
  // Round 1 is the last column with games before championship. WB final lives
  // in the column just before championship.
  if (col.round === totalRounds - 2) return 'Semifinals';
  return `Round ${col.round + 1}`;
}
