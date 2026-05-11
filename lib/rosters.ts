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
//   { name: 'First Last', jerseyNumber: 12, position: 'SS' }
//
// To mark a floater:
//   { name: 'First Last', isFloater: true, floatTo: 'prospect' }
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

export const DIVISION_LABEL: Record<Division, string> = {
  premier: 'Premier',
  prospect: 'Prospect',
  varsity: 'Varsity',
};

// ─────────────────────────────────────────────────────────────────────────────
// Academy rosters
// ─────────────────────────────────────────────────────────────────────────────

// PDG ─────────────────────────────────────────────────────────────────────────
// Floaters (5 total, all Premier↔Prospect):
//   Premier → Prospect: Damian Sasser, Jonathan Vousboukis
//   Prospect → Premier: Grant Shifflet, Dawson Tuell, Alfred Seaman

const PDG_PREMIER: Player[] = [
  { name: 'Wesley Hall' },
  { name: 'Lawson McLeod' },
  { name: 'Tyler Smith' },
  { name: 'Charles Tobler' },
  { name: 'Charlie Greiner' },
  { name: 'Tyler Townsend' },
  { name: 'Ryan Lemaire' },
  { name: 'Colin Barrett' },
  { name: 'Ty McGuirk' },
  { name: 'JT Thompson' },
  { name: 'Jerome Fortier' },
  { name: 'Damian Sasser', isFloater: true, floatTo: 'prospect' },
  { name: 'Jonathan Vousboukis', isFloater: true, floatTo: 'prospect' },
  { name: 'Carsten Hamilton' },
  { name: 'Chase Colangelo' },
  { name: 'Colin Francis' },
  { name: 'Jacob Barbour' },
  { name: 'Eli Rankin' },
  { name: 'Mason Miller' },
  { name: 'Justin Lee' },
  { name: 'Zavion Jackson' },
  { name: 'Jaxson Roberts' },
  { name: 'Reggie Thomas' },
];

const PDG_PROSPECT: Player[] = [
  { name: 'Tyrone Leach' },
  { name: 'Gavin Larson' },
  { name: 'Kain Castronuvo' },
  { name: 'Logan Adams' },
  { name: 'Sean-Alex Polanco' },
  { name: 'Caleb Mastin' },
  { name: 'Grant Shifflet', isFloater: true, floatTo: 'premier' },
  { name: 'Noah Fletcher' },
  { name: 'Mikey Marange' },
  { name: 'Mason Parker' },
  { name: 'Michael Burke' },
  { name: 'Michael Carter' },
  { name: 'Joey Fiore' },
  { name: 'Ryan Kim' },
  { name: 'Cole Sheppard' },
  { name: 'Dawson Tuell', isFloater: true, floatTo: 'premier' },
  { name: 'Chris Heinrich' },
  { name: 'Jude Hardy' },
  { name: 'Cooper Mong' },
  { name: 'Keagan Green' },
  { name: 'Bryce Radcliffe' },
  { name: 'Danny Kim' },
  { name: 'Alfred Seaman', isFloater: true, floatTo: 'premier' },
  { name: 'Lincoln Whitman' },
];

// ─────────────────────────────────────────────────────────────────────────────
// Master rosters map
// ─────────────────────────────────────────────────────────────────────────────

export const ROSTERS: Record<Division, Team[]> = {
  premier: [
    { teamId: 'premier.A3',   shortName: 'A3',   division: 'premier', players: [] },
    { teamId: 'premier.ECA',  shortName: 'ECA',  division: 'premier', players: [] },
    { teamId: 'premier.GPA',  shortName: 'GPA',  division: 'premier', players: [] },
    { teamId: 'premier.P27',  shortName: 'P27',  division: 'premier', players: [] },
    { teamId: 'premier.PDG',  shortName: 'PDG',  division: 'premier', players: PDG_PREMIER },
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
    { teamId: 'prospect.PDG',      shortName: 'PDG',      division: 'prospect', players: PDG_PROSPECT },
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
