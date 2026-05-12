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
  // Premier G1 — Tue 12:15 PM · F10 · WSA vs A3
  'premier.g1': {
    winner: 'premier.WSA',
    awayScore: null,
    homeScore: null,
    finalizedAt: TUE_GAME_END,
  },
  // Premier G2 — Tue 12:15 PM · F9 · ECA vs TNXL
  'premier.g2': {
    winner: 'premier.TNXL',
    awayScore: null,
    homeScore: null,
    finalizedAt: TUE_GAME_END,
  },
  // Premier G3 — Tue 3:00 PM · F9 · PDG vs GPA
  'premier.g3': {
    winner: 'premier.GPA',
    awayScore: null,
    homeScore: null,
    finalizedAt: TUE_GAME_END,
  },
  // Prospect G1 — Tue 9:30 AM · F11 · WSA vs CPCA
  'prospect.g1': {
    winner: 'prospect.CPCA',
    awayScore: null,
    homeScore: null,
    finalizedAt: TUE_GAME_END,
  },
  // Prospect G2 — Tue 9:30 AM · F12 · PDG vs ECA
  'prospect.g2': {
    winner: 'prospect.ECA',
    awayScore: null,
    homeScore: null,
    finalizedAt: TUE_GAME_END,
  },
  // Prospect G3 — Tue 12:15 PM · F11 · P27 vs DSC
  'prospect.g3': {
    winner: 'prospect.DSC',
    awayScore: null,
    homeScore: null,
    finalizedAt: TUE_GAME_END,
  },
  // Prospect G6 — Tue 12:15 PM · F12 · ECA (winnerOf g2) vs GPA
  'prospect.g6': {
    winner: 'prospect.GPA',
    awayScore: null,
    homeScore: null,
    finalizedAt: TUE_GAME_END,
  },
  // Prospect G4 — Tue 3:00 PM · F10 · A3 vs TNXL
  'prospect.g4': {
    winner: 'prospect.A3',
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
  // Varsity G2 — Tue 9:30 AM · F10 · WSA vs A3
  'varsity.g2': {
    winner: 'varsity.A3',
    awayScore: null,
    homeScore: null,
    finalizedAt: TUE_GAME_END,
  },
  // Varsity G6 — Tue 12:15 PM · F13 · A3 (winnerOf g2) vs CLUB
  'varsity.g6': {
    winner: 'varsity.CLUB',
    awayScore: null,
    homeScore: null,
    finalizedAt: TUE_GAME_END,
  },
  // Varsity G3 — Tue 3:00 PM · F12 · GPA vs FTB
  'varsity.g3': {
    winner: 'varsity.GPA',
    awayScore: null,
    homeScore: null,
    finalizedAt: TUE_GAME_END,
  },
  // JV G2 — Tue 10:00 AM · F2 · A3 MS JV vs FTB Academy JV
  'jv.g2': {
    winner: 'jv.A3MS',
    awayScore: null,
    homeScore: null,
    finalizedAt: TUE_GAME_END,
  },
  // JV G1 — Tue 11:00 AM · F1 · TNXL Academy vs Wellington JV
  'jv.g1': {
    winner: 'jv.TNXL',
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
