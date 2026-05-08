export type Division = 'premier' | 'prospect' | 'varsity';

export const DIVISIONS: readonly Division[] = ['premier', 'prospect', 'varsity'] as const;

export type GameId = `${Division}.g${number}` | `${Division}.fin` | `${Division}.if`;

export type TeamId = `${Division}.${string}`;

export type SlotRef =
  | { kind: 'team'; teamId: TeamId }
  | { kind: 'winnerOf'; gameId: GameId }
  | { kind: 'loserOf'; gameId: GameId };

export type BracketSide = 'WB' | 'LB' | 'POOL' | 'FINAL' | 'IF';

export type Game = {
  id: GameId;
  division: Division;
  bracket: BracketSide;
  gameNumber: number | null;     // 1-17 for numbered games; null for FIN/IF
  date: string;                  // ISO date "2026-05-12"
  time: string;                  // "10:00 AM" — already corrected per overrides at build time
  field: string;                 // "Field 9"
  away: SlotRef;
  home: SlotRef;
  // FIN games reference their conditional IF game
  ifGameId?: GameId;
};

export type GameResult = {
  winner: TeamId | null;
  awayScore: number | null;
  homeScore: number | null;
  finalizedAt: string | null;    // ISO timestamp
};

export type DivisionState = {
  results: Partial<Record<GameId, GameResult>>;
  updatedAt: string;
};

export const EMPTY_RESULT: GameResult = {
  winner: null,
  awayScore: null,
  homeScore: null,
  finalizedAt: null,
};

export function emptyDivisionState(): DivisionState {
  return { results: {}, updatedAt: new Date(0).toISOString() };
}
