import type { Division, GameId, GameResult } from './types';

/**
 * Seeded game results — applied when the live KV store has no entry for the
 * referenced game. Admin UI writes still take precedence per game, so these
 * function as defaults a deployment ships with rather than overrides.
 *
 * Use only when admin UI access isn't available and a result needs to land on
 * the public site (or to back-fill historical games into a fresh KV).
 */

// Static timestamps so the "Updated X ago" label is stable across re-renders.
// Approximate the actual end of each batch (~2hr after first pitch).
const TUE_GAME_END = '2026-05-12T15:30:00.000Z';
const WED_GAME_END = '2026-05-13T15:30:00.000Z';

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
  // Premier G6 — Wed 9:30 AM · F9 · ECA (loserOf g2) vs PDG (loserOf g3)
  'premier.g6': {
    winner: 'premier.PDG',
    awayScore: null,
    homeScore: null,
    finalizedAt: WED_GAME_END,
  },
  // Premier G5 — Wed 12:15 PM · F10 · TNXL (winnerOf g2) vs GPA (winnerOf g3)
  'premier.g5': {
    winner: 'premier.GPA',
    awayScore: null,
    homeScore: null,
    finalizedAt: WED_GAME_END,
  },
  // Premier G4 — Wed 12:15 PM · F9 · P27 vs WSA (winnerOf g1)
  'premier.g4': {
    winner: 'premier.WSA',
    awayScore: null,
    homeScore: null,
    finalizedAt: WED_GAME_END,
  },
  // Premier G7 — Wed 3:00 PM · F10 · A3 (loserOf g1) vs TNXL (loserOf g5)
  'premier.g7': {
    winner: 'premier.TNXL',
    awayScore: null,
    homeScore: null,
    finalizedAt: WED_GAME_END,
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
  // Prospect G5 — Tue 3:00 PM · F11 · CPCA (winnerOf g1) vs Kingsmen
  'prospect.g5': {
    winner: 'prospect.CPCA',
    awayScore: null,
    homeScore: null,
    finalizedAt: TUE_GAME_END,
  },
  // Prospect G8 — Wed 9:30 AM · F11 · WSA (loserOf g1) vs ECA (loserOf g6)
  'prospect.g8': {
    winner: 'prospect.ECA',
    awayScore: null,
    homeScore: null,
    finalizedAt: WED_GAME_END,
  },
  // Prospect G7 — Wed 9:30 AM · F10 · PDG (loserOf g2) vs Kingsmen (loserOf g5)
  'prospect.g7': {
    winner: 'prospect.Kingsmen',
    awayScore: null,
    homeScore: null,
    finalizedAt: WED_GAME_END,
  },
  // Prospect G9 — Wed 12:15 PM · F11 · Kingsmen (winnerOf g7) vs P27 (loserOf g3)
  'prospect.g9': {
    winner: 'prospect.Kingsmen',
    awayScore: null,
    homeScore: null,
    finalizedAt: WED_GAME_END,
  },
  // Prospect G11 — Wed 12:15 PM · F12 · DSC (winnerOf g3) vs CPCA (winnerOf g5)
  'prospect.g11': {
    winner: 'prospect.CPCA',
    awayScore: null,
    homeScore: null,
    finalizedAt: WED_GAME_END,
  },
  // Prospect G12 — Wed 9:30 AM · F12 · A3 (winnerOf g4) vs GPA (winnerOf g6)
  'prospect.g12': {
    winner: 'prospect.A3',
    awayScore: null,
    homeScore: null,
    finalizedAt: WED_GAME_END,
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
  // Varsity G4 — Tue 9:30 AM · F13 · KINGS vs P27
  'varsity.g4': {
    winner: 'varsity.KINGS',
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
  // Varsity G5 — Tue 3:00 PM · F13 · TNXL (winnerOf g1) vs CPCA
  'varsity.g5': {
    winner: 'varsity.CPCA',
    awayScore: null,
    homeScore: null,
    finalizedAt: TUE_GAME_END,
  },
  // Varsity G8 — Wed 9:30 AM · F14 · ECA (loserOf g1) vs A3 (loserOf g6)
  'varsity.g8': {
    winner: 'varsity.A3',
    awayScore: null,
    homeScore: null,
    finalizedAt: WED_GAME_END,
  },
  // Varsity G7 — Wed 9:30 AM · F13 · WSA (loserOf g2) vs TNXL (loserOf g5)
  'varsity.g7': {
    winner: 'varsity.WSA',
    awayScore: null,
    homeScore: null,
    finalizedAt: WED_GAME_END,
  },
  // Varsity G10 — Wed 3:00 PM · F14 · A3 (winnerOf g8) vs P27 (loserOf g4)
  'varsity.g10': {
    winner: 'varsity.P27',
    awayScore: null,
    homeScore: null,
    finalizedAt: WED_GAME_END,
  },
  // Varsity G11 — Wed 3:00 PM · F12 · GPA (winnerOf g3) vs CPCA (winnerOf g5)
  'varsity.g11': {
    winner: 'varsity.GPA',
    awayScore: null,
    homeScore: null,
    finalizedAt: WED_GAME_END,
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
  // JV G3 — Wed 9:00 AM · F1 · CLUB vs TNXL (winnerOf g1)
  'jv.g3': {
    winner: 'jv.TNXL',
    awayScore: null,
    homeScore: null,
    finalizedAt: WED_GAME_END,
  },
  // JV G4 — Wed 9:00 AM · F2 · A3 HS vs A3 MS (winnerOf g2)
  'jv.g4': {
    winner: 'jv.A3MS',
    awayScore: null,
    homeScore: null,
    finalizedAt: WED_GAME_END,
  },
  // JV G6 — Wed 10:00 AM · F1 · CLUB (loserOf g3) vs A3 HS (loserOf g4)
  'jv.g6': {
    winner: 'jv.CLUB',
    awayScore: null,
    homeScore: null,
    finalizedAt: WED_GAME_END,
  },
  // JV G5 — Wed 10:00 AM · F2 · WSA (loserOf g1) vs FTB (loserOf g2)
  'jv.g5': {
    winner: 'jv.WSA',
    awayScore: null,
    homeScore: null,
    finalizedAt: WED_GAME_END,
  },
  // JV G7 — Wed 12:30 PM · F2 (WB Final) · TNXL (winnerOf g3) vs A3 MS (winnerOf g4)
  'jv.g7': {
    winner: 'jv.A3MS',
    awayScore: null,
    homeScore: null,
    finalizedAt: WED_GAME_END,
  },
  // JV G8 — Wed 12:30 PM · F1 · WSA (winnerOf g5) vs CLUB (winnerOf g6)
  'jv.g8': {
    winner: 'jv.WSA',
    awayScore: null,
    homeScore: null,
    finalizedAt: WED_GAME_END,
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
