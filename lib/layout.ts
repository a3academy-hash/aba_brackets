import { GAMES_BY_DIVISION, GAMES_BY_ID } from './schedule';
import { gameRound } from './bracket';
import type { Division, Game, GameId, TeamId } from './types';

/**
 * Pyramid bracket layout. Computes pixel coordinates for every game card
 * (and the championship/IF) so the renderer can absolute-position them and
 * draw SVG step-connectors between feeder/feedee pairs.
 *
 * Algorithm: depth-first walk from each section root (WB final, LB final).
 * Pure-team feeders (pool entries / WB byes / LB ghost-feeder labels for
 * "Loser of GX") each take one leaf-row of vertical space; inner games sit
 * at the midpoint y of their two feeders. Cards are then positioned at
 * `x = round * (COL_W + COL_GAP)`, vertical center = computed y.
 */

export type Pos = { x: number; y: number };

export type ByeLeaf = {
  /** Game whose team-slot this bye belongs to */
  parentGameId: GameId;
  team: TeamId;
  y: number;
  /** x position for the pill — one column-width to the left of the parent card */
  x: number;
  /** Which slot of the parent the bye occupies — for the connector to know which row to enter */
  side: 'away' | 'home';
};

export type Layout = {
  positions: Map<GameId, Pos>;
  byes: ByeLeaf[];
  width: number;
  height: number;
  lbStartY: number;
  /** Final game id (for championship rendering) */
  finId: GameId;
  ifId: GameId;
  /** Highest round number in WB / LB / championship */
  totalRounds: number;
  /** WB-side final round (where the WB tree root lives) */
  wbFinalRound: number;
  /** LB-side final round (where the LB tree root lives) */
  lbFinalRound: number;
  /** WB section y range — used to position the WB rail label */
  wbStartY: number;
  wbBottomY: number;
  lbBottomY: number;
};

/** Card geometry constants. Exported so the renderer + connector code can match. */
export const CARD_W_DESKTOP = 126;
export const CARD_W_MOBILE = 200;
export const CARD_H = 92;        // header (~20) + two 36px team rows
export const COL_GAP = 16;
export const ROW_H = 56;         // one leaf-row of vertical space; 2*ROW_H > CARD_H so stacked cards don't collide
export const SECTION_GAP = 80;   // gap between WB section bottom and LB section top
export const BYE_PILL_W = 60;    // small pill width for bye leaf labels
export const BYE_PILL_H = 24;

export type LayoutOpts = { cardWidth: number };

const isWB = (g: Game) => g.bracket === 'WB' || g.bracket === 'POOL';
const isLB = (g: Game) => g.bracket === 'LB';
const isPoolish = (g: Game) =>
  g.away.kind === 'team' && g.home.kind === 'team';

export function layoutDivision(div: Division, opts: LayoutOpts = { cardWidth: CARD_W_DESKTOP }): Layout {
  const { cardWidth } = opts;
  const colStride = cardWidth + COL_GAP;
  const colX = (round: number) => round * colStride;

  const games = GAMES_BY_DIVISION[div];
  const wbGames = games.filter(isWB);
  const lbGames = games.filter(isLB);
  const finGame = games.find((g) => g.bracket === 'FINAL');
  const ifGame = games.find((g) => g.bracket === 'IF');
  if (!finGame || !ifGame) {
    throw new Error(`layout: division ${div} is missing FINAL or IF game`);
  }

  const wbRoot = wbGames.reduce(
    (best, g) => (gameRound(g.id) > gameRound(best.id) ? g : best),
    wbGames[0],
  );
  const lbRoot = lbGames.reduce(
    (best, g) => (gameRound(g.id) > gameRound(best.id) ? g : best),
    lbGames[0],
  );

  const positions = new Map<GameId, Pos>();
  const byes: ByeLeaf[] = [];

  let nextLeafY = 0;

  function place(game: Game, section: 'wb' | 'lb'): number {
    const cached = positions.get(game.id);
    if (cached) return cached.y;
    const slots: Array<{ slot: typeof game.away; side: 'away' | 'home' }> = [
      { slot: game.away, side: 'away' },
      { slot: game.home, side: 'home' },
    ];
    const fy: number[] = [];
    for (const { slot, side } of slots) {
      if (slot.kind === 'team') {
        const y = nextLeafY + ROW_H / 2;
        nextLeafY += ROW_H;
        // If the parent game is "pool-like" (both slots are team), render the
        // teams inline on the card. Otherwise it's a bye into a higher-round
        // game — record it as an external leaf pill.
        if (!isPoolish(game) && section === 'wb') {
          byes.push({
            parentGameId: game.id,
            team: slot.teamId,
            y,
            x: colX(gameRound(game.id)) - cardWidth - COL_GAP / 2,
            side,
          });
        }
        fy.push(y);
      } else if (slot.kind === 'loserOf') {
        // LB ghost feeder ("Loser of GX") — one leaf row, displayed as a
        // placeholder slot on the card itself.
        const y = nextLeafY + ROW_H / 2;
        nextLeafY += ROW_H;
        fy.push(y);
      } else {
        const ref = GAMES_BY_ID[slot.gameId];
        const inSection =
          (section === 'wb' && ref && isWB(ref)) ||
          (section === 'lb' && ref && isLB(ref));
        if (inSection) {
          fy.push(place(ref, section));
        } else {
          const y = nextLeafY + ROW_H / 2;
          nextLeafY += ROW_H;
          fy.push(y);
        }
      }
    }
    const y = (fy[0] + fy[1]) / 2;
    positions.set(game.id, { x: colX(gameRound(game.id)), y });
    return y;
  }

  const wbStartY = ROW_H / 2;
  nextLeafY = wbStartY;
  place(wbRoot, 'wb');
  const wbBottomY = nextLeafY;

  const lbStartY = wbBottomY + SECTION_GAP;
  nextLeafY = lbStartY + ROW_H / 2;
  place(lbRoot, 'lb');
  const lbBottomY = nextLeafY;

  const wbFinalPos = positions.get(wbRoot.id)!;
  const lbFinalPos = positions.get(lbRoot.id)!;
  const finRound = gameRound(finGame.id);
  const finY = (wbFinalPos.y + lbFinalPos.y) / 2;
  positions.set(finGame.id, { x: colX(finRound), y: finY });

  const ifY = finY + CARD_H + 24;
  positions.set(ifGame.id, { x: colX(finRound), y: ifY });

  const width = colX(finRound) + cardWidth;
  const height = Math.max(lbBottomY, ifY + CARD_H / 2 + ROW_H / 2);

  return {
    positions,
    byes,
    width,
    height,
    lbStartY,
    finId: finGame.id,
    ifId: ifGame.id,
    totalRounds: finRound + 1,
    wbFinalRound: gameRound(wbRoot.id),
    lbFinalRound: gameRound(lbRoot.id),
    wbStartY,
    wbBottomY,
    lbBottomY,
  };
}

/** Round x position (for the round-label rail) */
export function roundColumnX(round: number, cardWidth: number): number {
  return round * (cardWidth + COL_GAP);
}
