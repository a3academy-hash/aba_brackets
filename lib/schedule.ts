import gamesData from './schedule/games.json';
import type { Division, Game, GameId } from './types';
import { DIVISIONS } from './types';

const games = gamesData as Game[];

export const ALL_GAMES: readonly Game[] = games;

export const GAMES_BY_ID: Readonly<Record<GameId, Game>> = Object.freeze(
  Object.fromEntries(games.map((g) => [g.id, g])),
) as Record<GameId, Game>;

export const GAMES_BY_DIVISION: Readonly<Record<Division, readonly Game[]>> = Object.freeze({
  premier:  games.filter((g) => g.division === 'premier'),
  prospect: games.filter((g) => g.division === 'prospect'),
  varsity:  games.filter((g) => g.division === 'varsity'),
  jv:       games.filter((g) => g.division === 'jv'),
});

export function getGame(id: GameId): Game {
  const g = GAMES_BY_ID[id];
  if (!g) throw new Error(`Unknown game id: ${id}`);
  return g;
}

export function getDivisionGames(div: Division): readonly Game[] {
  return GAMES_BY_DIVISION[div];
}

// Sanity check at module load: counts must match the spec.
// If this throws, the importer regenerated games.json with a structural change
// or a hand-edited division (JV) was modified without updating the count.
{
  const expected: Record<Division, number> = {
    premier: 13,
    prospect: 19,
    varsity: 19,
    jv: 11,
  };
  for (const div of DIVISIONS) {
    const got = GAMES_BY_DIVISION[div].length;
    if (got !== expected[div]) {
      throw new Error(
        `schedule.ts: ${div} has ${got} games, expected ${expected[div]}. ` +
          `Re-run scripts/extract-schedule.py and check the source PDF.`,
      );
    }
  }
}
