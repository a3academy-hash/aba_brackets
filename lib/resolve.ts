import { GAMES_BY_ID } from './schedule';
import { defaultChampionshipLabels, labelOverrides } from './scheduleOverrides';
import type { Game, GameId, GameResult, SlotRef, TeamId } from './types';

export type ResolvedSlot =
  | { kind: 'team'; teamId: TeamId; displayName: string; isWinner: boolean }
  | { kind: 'placeholder'; label: string };

/**
 * Override map for team display names — used when the team's bracket short code
 * (the segment after the division prefix in its TeamId) doesn't match the
 * desired card label. Keep entries sparse: only add an override when the slice
 * fallback ("CLUB" → "CLUB") would be wrong.
 */
const TEAM_DISPLAY_NAMES: Partial<Record<TeamId, string>> = {
  // JV bracket teams. Source labels include team-specific branding the bracket
  // ID can't carry (spaces, suffixes).
  'jv.CLUB': 'Clubhouse Commanders',
  'jv.A3HS': 'A3 HS JV',
  'jv.A3MS': 'A3 MS JV',
  'jv.TNXL': 'TNXL Academy',
  'jv.WSA':  'Wellington JV',
  'jv.FTB':  'FTB Academy JV',
};

export function teamDisplayName(teamId: TeamId): string {
  const ov = TEAM_DISPLAY_NAMES[teamId];
  if (ov) return ov;
  // teamId = "${division}.${name}" — drop the division prefix
  const dot = teamId.indexOf('.');
  return teamId.slice(dot + 1);
}

/**
 * Walk a SlotRef until either a concrete TeamId is known (resolved) or we run
 * out of decided games (placeholder like "Winner of G1").
 *
 * Lazy: we never write resolved values back into other games' rows. Re-running
 * with updated results just returns different answers.
 */
export function resolveSlot(
  slot: SlotRef,
  results: Partial<Record<GameId, GameResult>>,
): ResolvedSlot {
  if (slot.kind === 'team') {
    return {
      kind: 'team',
      teamId: slot.teamId,
      displayName: teamDisplayName(slot.teamId),
      isWinner: false,
    };
  }

  const refResult = results[slot.gameId];
  const refGame = GAMES_BY_ID[slot.gameId];

  if (refResult?.winner) {
    if (slot.kind === 'winnerOf') {
      return {
        kind: 'team',
        teamId: refResult.winner,
        displayName: teamDisplayName(refResult.winner),
        isWinner: true,
      };
    }
    // loserOf: resolve both sides of the referenced game and pick the non-winner
    if (refGame) {
      const a = resolveSlot(refGame.away, results);
      const b = resolveSlot(refGame.home, results);
      const teams: TeamId[] = [];
      if (a.kind === 'team') teams.push(a.teamId);
      if (b.kind === 'team') teams.push(b.teamId);
      const loser = teams.find((t) => t !== refResult.winner);
      if (loser) {
        return {
          kind: 'team',
          teamId: loser,
          displayName: teamDisplayName(loser),
          isWinner: false,
        };
      }
    }
  }

  // Not yet resolved — produce a human-readable placeholder
  const prefix = slot.kind === 'winnerOf' ? 'Winner' : 'Loser';
  const label = refGame ? `${prefix} of ${gameShortLabel(refGame)}` : `${prefix} of ${slot.gameId}`;
  return { kind: 'placeholder', label };
}

export function gameShortLabel(game: Game): string {
  if (game.gameNumber != null) return `G${game.gameNumber}`;
  if (game.bracket === 'FINAL') return 'Final';
  if (game.bracket === 'IF') return 'IF';
  return game.id;
}

export function gameTitleLabel(game: Game): string {
  // Override → default championship label → "Game N"
  const ov = labelOverrides[game.id]?.label;
  if (ov) return ov;
  const def = defaultChampionshipLabels[game.id];
  if (def) return def;
  if (game.gameNumber != null) return `Game ${game.gameNumber}`;
  return game.id;
}

export function gameDisplayTime(game: Game): string {
  return labelOverrides[game.id]?.time ?? game.time;
}
