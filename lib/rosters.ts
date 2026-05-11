// ─────────────────────────────────────────────────────────────────────────────
// EDIT BELOW — team rosters for the ABA National Championship.
//
// Teams submitted rosters in mixed formats (Excel, PDF, lists, etc.). As they
// are standardized, drop them into the matching team in ROSTERS below.
// Empty teams render as "Roster Pending" on the public page.
//
// Floaters: a player who can play in BOTH their primary division and an
// adjacent division (Premier↔Prospect, Prospect↔Varsity). Premier↔Varsity is
// NOT allowed (non-adjacent). Each team is allowed up to 5 floaters.
//
// Convention: floaters are listed in a separate `floaters` array — they are
// NOT duplicated in `players`. For an academy with two adjacent teams, the
// SAME floater objects appear in both teams' `floaters` arrays so all five
// floaters show up at the bottom of each team's roster card. Each floater
// has a `primaryDivision` indicating which team they are officially rostered
// to (the other being the adjacent division they can float into).
//
// Example:
//   const PDG_FLOATERS: Player[] = [
//     { name: 'Damian Sasser', primaryDivision: 'premier' },
//     { name: 'Grant Shifflet', primaryDivision: 'prospect' },
//     ...
//   ];
//   premier.PDG.floaters = PDG_FLOATERS
//   prospect.PDG.floaters = PDG_FLOATERS
// ─────────────────────────────────────────────────────────────────────────────

import type { Division, TeamId } from './types';

export type Player = {
  name: string;
  jerseyNumber?: number | string;
  position?: string;
  bats?: 'L' | 'R' | 'S';
  throws?: 'L' | 'R';
  /**
   * Only set on entries in `Team.floaters`. The division the player is
   * primarily rostered to — the other adjacent division is where they can
   * also play. Premier↔Prospect or Prospect↔Varsity only.
   */
  primaryDivision?: Division;
  notes?: string;
};

export type Team = {
  teamId: TeamId;
  /** Short label used on bracket cards. */
  shortName: string;
  /** Full organization name; falls back to shortName on the rosters page. */
  fullName?: string;
  division: Division;
  /** Regular (non-floater) roster. */
  players: Player[];
  /**
   * Up to 5 floaters eligible for this team plus an adjacent team. For an
   * academy that fields two adjacent teams, the same floater list is shared
   * between both teams so all 5 floaters appear at the bottom of both cards.
   */
  floaters?: Player[];
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
  { name: 'Noah Fletcher' },
  { name: 'Mikey Marange' },
  { name: 'Mason Parker' },
  { name: 'Michael Burke' },
  { name: 'Michael Carter' },
  { name: 'Joey Fiore' },
  { name: 'Ryan Kim' },
  { name: 'Cole Sheppard' },
  { name: 'Chris Heinrich' },
  { name: 'Jude Hardy' },
  { name: 'Cooper Mong' },
  { name: 'Keagan Green' },
  { name: 'Bryce Radcliffe' },
  { name: 'Danny Kim' },
  { name: 'Lincoln Whitman' },
];

const PDG_FLOATERS: Player[] = [
  { name: 'Damian Sasser',       primaryDivision: 'premier'  },
  { name: 'Jonathan Vousboukis', primaryDivision: 'premier'  },
  { name: 'Grant Shifflet',      primaryDivision: 'prospect' },
  { name: 'Dawson Tuell',        primaryDivision: 'prospect' },
  { name: 'Alfred Seaman',       primaryDivision: 'prospect' },
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
    { teamId: 'premier.PDG',  shortName: 'PDG',  division: 'premier', players: PDG_PREMIER, floaters: PDG_FLOATERS },
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
    { teamId: 'prospect.PDG',      shortName: 'PDG',      division: 'prospect', players: PDG_PROSPECT, floaters: PDG_FLOATERS },
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
