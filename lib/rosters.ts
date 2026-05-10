// ─────────────────────────────────────────────────────────────────────────────
// EDIT BELOW — team rosters for the ABA National Championship.
//
// Teams submitted rosters in mixed formats (Excel, PDF, lists, etc.). As they
// are standardized, drop them into the `players` array of the matching team.
// The Rosters page renders empty teams as "Roster pending."
//
// Floaters: a player who can play in BOTH their primary division and an
// adjacent division (Premier↔Prospect, Prospect↔Varsity). Premier↔Varsity is
// NOT allowed because those divisions are not adjacent. Each team is allowed
// up to 5 floaters. Mark a player with `isFloater: true` and set `floatTo` to
// the adjacent division they may play up/down to.
//
// To add a player:
//   { name: 'Last, First', jerseyNumber: 12, position: 'SS' }
//
// To mark a floater:
//   { name: 'Last, First', isFloater: true, floatTo: 'prospect' }
// ─────────────────────────────────────────────────────────────────────────────

import type { Division, TeamId } from './types';

export type Player = {
  name: string;
  jerseyNumber?: number | string;
  position?: string;
  bats?: 'L' | 'R' | 'S';
  throws?: 'L' | 'R';
  /** True if this player is one of the team's (up to 5) floaters. */
  isFloater?: boolean;
  /**
   * The adjacent division this floater may also play in. Required when
   * `isFloater` is true. Premier↔Prospect and Prospect↔Varsity only —
   * Premier↔Varsity is not allowed (non-adjacent).
   */
  floatTo?: Division;
  notes?: string;
};

export type Team = {
  teamId: TeamId;
  /** Short label used on bracket cards. */
  shortName: string;
  /** Full organization name; falls back to shortName on the rosters page. */
  fullName?: string;
  division: Division;
  players: Player[];
};

// Adjacency map for floater validation. Premier and Varsity are NOT adjacent.
export const FLOAT_ADJACENCY: Record<Division, readonly Division[]> = {
  premier: ['prospect'],
  prospect: ['premier', 'varsity'],
  varsity: ['prospect'],
};

export const FLOATER_LIMIT_PER_TEAM = 5;

export const ROSTERS: Record<Division, Team[]> = {
  premier: [
    { teamId: 'premier.A3',   shortName: 'A3',   division: 'premier', players: [] },
    { teamId: 'premier.ECA',  shortName: 'ECA',  division: 'premier', players: [] },
    { teamId: 'premier.GPA',  shortName: 'GPA',  division: 'premier', players: [] },
    { teamId: 'premier.P27',  shortName: 'P27',  division: 'premier', players: [] },
    { teamId: 'premier.PDG',  shortName: 'PDG',  division: 'premier', players: [] },
    { teamId: 'premier.TNXL', shortName: 'TNXL', division: 'premier', players: [] },
    { teamId: 'premier.WSA',  shortName: 'WSA',  division: 'premier', players: [] },
  ],
  prospect: [
    { teamId: 'prospect.A3',       shortName: 'A3',       division: 'prospect', players: [] },
    { teamId: 'prospect.CPCA',     shortName: 'CPCA',     division: 'prospect', players: [] },
    { teamId: 'prospect.DSC',      shortName: 'DSC',      division: 'prospect', players: [] },
    { teamId: 'prospect.ECA',      shortName: 'ECA',      division: 'prospect', players: [] },
    { teamId: 'prospect.GPA',      shortName: 'GPA',      division: 'prospect', players: [] },
    { teamId: 'prospect.Kingsmen', shortName: 'Kingsmen', division: 'prospect', players: [] },
    { teamId: 'prospect.P27',      shortName: 'P27',      division: 'prospect', players: [] },
    { teamId: 'prospect.PDG',      shortName: 'PDG',      division: 'prospect', players: [] },
    { teamId: 'prospect.TNXL',     shortName: 'TNXL',     division: 'prospect', players: [] },
    { teamId: 'prospect.WSA',      shortName: 'WSA',      division: 'prospect', players: [] },
  ],
  varsity: [
    { teamId: 'varsity.A3',    shortName: 'A3',        division: 'varsity', players: [] },
    { teamId: 'varsity.CLUB',  shortName: 'Clubhouse', division: 'varsity', players: [] },
    { teamId: 'varsity.CPCA',  shortName: 'CPCA',      division: 'varsity', players: [] },
    { teamId: 'varsity.ECA',   shortName: 'ECA',       division: 'varsity', players: [] },
    { teamId: 'varsity.FTB',   shortName: 'FTB',       division: 'varsity', players: [] },
    { teamId: 'varsity.GPA',   shortName: 'GPA',       division: 'varsity', players: [] },
    { teamId: 'varsity.KINGS', shortName: 'KINGS',     division: 'varsity', players: [] },
    { teamId: 'varsity.P27',   shortName: 'P27',       division: 'varsity', players: [] },
    { teamId: 'varsity.TNXL',  shortName: 'TNXL',      division: 'varsity', players: [] },
    { teamId: 'varsity.WSA',   shortName: 'WSA',       division: 'varsity', players: [] },
  ],
};

export const DIVISION_LABEL: Record<Division, string> = {
  premier: 'Premier',
  prospect: 'Prospect',
  varsity: 'Varsity',
};
