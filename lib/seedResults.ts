import type { Division, GameId, GameResult } from './types';

/**
 * Seeded game results — applied when the live KV store has no entry for the
 * referenced game. Admin UI writes still take precedence per game, so these
 * function as defaults a deployment ships with rather than overrides.
 *
 * Use only when admin UI access isn't available and a result needs to land on
 * the public site (or to back-fill historical games into a fresh KV).
 */

// Static timestamp so the "Updated X ago" label is stable across re-renders.
// Approximates the actual end of the games (Tue 5/12, ~2hr after 9:30 AM ET).
const TUE_GAME_END = '2026-05-12T15:30:00.000Z';

export const SEED_RESULTS: Partial<Record<GameId, GameResult>> = {
  // Prospect G2 — Tue 9:30 AM · F12 · PDG vs ECA
  'prospect.g2': {
    winner: 'prospect.ECA',
    awayScore: null,
    homeScore: null,
    finalizedAt: TUE_GAME_END,
  },
  // Varsity G1 — Tue 9:30 AM · F9 · ECA vs TNXL
  'varsity.g1': {
    winner: 'varsity.TNXL',
    awayScore: null,
    homeScore: null,
    finalizedAt: TUE_GAME_END,
  },
};

export function seedResultsForDivision(
  div: Division,
): Partial<Record<GameId, GameResult>> {
  const out: Partial<Record<GameId, GameResult>> = {};
  for (const [gameId, result] of Object.entries(SEED_RESULTS)) {
    if (result && gameId.startsWith(`${div}.`)) {
      (out as Record<string, GameResult>)[gameId] = result;
    }
  }
  return out;
}

export function seedLatestFinalizedAt(div: Division): string | null {
  const seed = seedResultsForDivision(div);
  const times: string[] = [];
  for (const r of Object.values(seed)) {
    if (r?.finalizedAt) times.push(r.finalizedAt);
  }
  if (times.length === 0) return null;
  return times.sort().at(-1) ?? null;
}
