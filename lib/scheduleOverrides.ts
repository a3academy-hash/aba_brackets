import { GAMES_BY_ID } from './schedule';
import type { GameId } from './types';

/**
 * Render-time corrections for known typos and missing data in the source PDF.
 *
 * NEVER edit the source CSV/PDF in `data/` to "fix" these — the importer must
 * stay a pure function of the source file so a re-export from the original
 * Google Sheet always reproduces the same JSON. Apply corrections here, where
 * the next reader can see what we're overriding and why.
 *
 * Keys must be valid GameIds that exist in the parsed schedule. The
 * build-time assertion at the bottom of this file fails loudly if a key
 * doesn't match — so a renamed/removed game won't silently ignore its
 * override.
 */
export interface ScheduleOverride {
  /** Replaces the rendered matchup label (used for the championship rows that
   *  have no team-vs-team text in the cell). */
  label?: string;
  /** Replaces the rendered tip-off time. The raw cell time is preserved in
   *  the JSON so we can audit what the source actually contained. */
  time?: string;
}

export const labelOverrides: Partial<Record<GameId, ScheduleOverride>> = {
  // Premier championship times — the PDF has the cells positioned in the
  // 9:30 AM / 12:15 PM time rows, but the inline text reads
  // "Premier Championship (10am)" and "IF Premier Champ G2 (1am)".
  // The "(1am)" is a typo for 1pm (a Friday afternoon game). Both times
  // confirmed by Matt as the actual tip-off times.
  'premier.fin': { time: '10:00 AM' },
  'premier.if':  { time: '1:00 PM' },
};

/**
 * Default labels for FINAL/IF games that don't have a teams-vs-teams text in
 * the PDF cell. Used when no override label is set.
 */
export const defaultChampionshipLabels: Partial<Record<GameId, string>> = {
  'premier.fin':  'Premier Championship',
  'premier.if':   'IF Premier Championship',
  'prospect.fin': 'Prospect Championship',
  'prospect.if':  'IF Prospect Championship',
  'varsity.fin':  'Varsity Championship',
  'varsity.if':   'IF Varsity Championship',
};

// Build-time assertion: every key in labelOverrides must reference a real game.
// This runs at module load (= at first import during build/dev/SSR), so any
// schedule-id rename surfaces as a hard error instead of a silent no-op.
{
  const allKeys = [
    ...Object.keys(labelOverrides),
    ...Object.keys(defaultChampionshipLabels),
  ] as GameId[];
  const missing = allKeys.filter((id) => !GAMES_BY_ID[id]);
  if (missing.length > 0) {
    throw new Error(
      `scheduleOverrides.ts references unknown game IDs: ${missing.join(', ')}. ` +
        `Either the importer renamed these games or the override is stale — ` +
        `update lib/scheduleOverrides.ts.`,
    );
  }
}
