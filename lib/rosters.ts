// ─────────────────────────────────────────────────────────────────────────────
// EDIT BELOW — team rosters for the ABA National Championship.
//
// Teams submitted rosters in mixed formats (Excel, PDF, lists, etc.). As they
// are standardized, drop them into the matching team in ROSTERS below.
// Empty teams render as "Roster Pending" on the public page.
//
// Floaters: a player who can play in BOTH their primary division and an
// adjacent division (Premier↔Prospect, Prospect↔Varsity). Premier↔Varsity is
// NOT allowed (non-adjacent). Each adjacency pair allows up to 5 floaters —
// so a Prospect team in a three-division academy can show up to 10 floaters
// total (5 with Premier + 5 with Varsity).
//
// Convention: floaters are listed in a separate `floaters` array — they are
// NOT duplicated in `players`. The same floater objects appear in both teams
// of an adjacency pair so the names stay in sync. Each floater has a
// `primaryDivision` indicating which team they are officially rostered to
// (the other being the adjacent division they can float into).
//
// Example — two-division academy (PDG):
//   const PDG_FLOATERS: Player[] = [
//     { name: 'Damian Sasser', primaryDivision: 'premier' },
//     { name: 'Grant Shifflet', primaryDivision: 'prospect' },
//     ...
//   ];
//   premier.PDG.floaters  = PDG_FLOATERS
//   prospect.PDG.floaters = PDG_FLOATERS
//
// Example — three-division academy (P27):
//   const P27_PREM_PROS_FLOATERS = [...5 names, primary premier or prospect];
//   const P27_PROS_VARS_FLOATERS = [...5 names, primary prospect or varsity];
//   premier.P27.floaters  = P27_PREM_PROS_FLOATERS
//   prospect.P27.floaters = [...P27_PREM_PROS_FLOATERS, ...P27_PROS_VARS_FLOATERS]
//   varsity.P27.floaters  = P27_PROS_VARS_FLOATERS
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
   * Floaters eligible for this team plus at least one adjacent team. Up to 5
   * per adjacency pair (Premier↔Prospect, Prospect↔Varsity). A Prospect team
   * in a three-division academy may carry both pools — up to 10 entries.
   */
  floaters?: Player[];
};

// Adjacency map for floater validation. Premier and Varsity are NOT adjacent.
export const FLOAT_ADJACENCY: Record<Division, readonly Division[]> = {
  premier: ['prospect'],
  prospect: ['premier', 'varsity'],
  varsity: ['prospect'],
};

/** Up to 5 floaters per adjacency pair (Premier↔Prospect, Prospect↔Varsity). */
export const FLOATER_LIMIT_PER_PAIR = 5;

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

// P27 ─────────────────────────────────────────────────────────────────────────
// Source: last names only. Premier↔Prospect floaters were highlighted green
// in the source spreadsheet; Prospect↔Varsity floaters highlighted yellow.

const P27_PREMIER: Player[] = [
  { name: 'Mucica' },
  { name: 'Doubrout' },
  { name: 'Almanzar' },
  { name: 'Burkert' },
  { name: 'Acevedo' },
  { name: 'Coaxum' },
  { name: 'Tassopoulos' },
  { name: 'Fallon' },
  { name: 'Woodard' },
  { name: 'Lopez' },
  { name: 'Powell' },
  { name: 'Anderson' },
  { name: 'Conradt' },
  { name: 'Russel' },
  { name: 'Carver' },
];

const P27_PROSPECT: Player[] = [
  { name: 'Alverez' },
  { name: 'Kolbert' },
  { name: 'Y. Soto' },
  { name: 'Epting' },
  { name: 'Goettke' },
  { name: 'Moon' },
  { name: 'Vega' },
  { name: 'Almonte' },
  { name: 'Haug' },
  { name: 'Sosbee' },
  { name: 'Martinez' },
  { name: 'Cali' },
  { name: 'Smith' },
  { name: 'Bailey' },
];

const P27_VARSITY: Player[] = [
  { name: 'Sanchez' },
  { name: 'Eckroth' },
  { name: 'Aristy' },
  { name: 'E. Soto' },
  { name: 'Blankanship' },
  { name: 'Jones' },
  { name: 'Perez' },
  { name: 'Brinson' },
  { name: 'T. Soto' },
  { name: 'Prentiss' },
  { name: 'Munchel' },
  { name: 'Fraser' },
  { name: 'Jenkins' },
  { name: 'Knight' },
  { name: 'Nieves' },
  { name: 'Hardner' },
  { name: 'Cole' },
  { name: 'Brittingham' },
  { name: 'Mott' },
  { name: 'Flatt' },
  { name: 'Penny' },
  { name: 'Azarieh' },
  { name: 'Buress' },
];

// 5 floaters between Premier and Prospect — all green in the source.
// All five appeared in the Premier column → primaryDivision: 'premier'.
const P27_PREM_PROS_FLOATERS: Player[] = [
  { name: 'Oritz',    primaryDivision: 'premier' },
  { name: 'Smirak',   primaryDivision: 'premier' },
  { name: 'Head',     primaryDivision: 'premier' },
  { name: 'Szabo',    primaryDivision: 'premier' },
  { name: 'Bohnsack', primaryDivision: 'premier' },
];

// 5 floaters between Prospect and Varsity — all yellow in the source.
// All five appeared in the Prospect column → primaryDivision: 'prospect'.
const P27_PROS_VARS_FLOATERS: Player[] = [
  { name: 'Pollock', primaryDivision: 'prospect' },
  { name: 'Lima',    primaryDivision: 'prospect' },
  { name: 'Graham',  primaryDivision: 'prospect' },
  { name: 'Aragon',  primaryDivision: 'prospect' },
  { name: 'Stocks',  primaryDivision: 'prospect' },
];

// Prospect team carries BOTH pools (up to 10 floaters total).
const P27_PROSPECT_FLOATERS: Player[] = [
  ...P27_PREM_PROS_FLOATERS,
  ...P27_PROS_VARS_FLOATERS,
];

// ─────────────────────────────────────────────────────────────────────────────
// Master rosters map
// ─────────────────────────────────────────────────────────────────────────────

export const ROSTERS: Record<Division, Team[]> = {
  premier: [
    { teamId: 'premier.A3',   shortName: 'A3',   division: 'premier', players: [] },
    { teamId: 'premier.ECA',  shortName: 'ECA',  division: 'premier', players: [] },
    { teamId: 'premier.GPA',  shortName: 'GPA',  division: 'premier', players: [] },
    { teamId: 'premier.P27',  shortName: 'P27',  division: 'premier', players: P27_PREMIER, floaters: P27_PREM_PROS_FLOATERS },
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
    { teamId: 'prospect.P27',      shortName: 'P27',      division: 'prospect', players: P27_PROSPECT, floaters: P27_PROSPECT_FLOATERS },
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
    { teamId: 'varsity.P27',   shortName: 'P27',       division: 'varsity', players: P27_VARSITY, floaters: P27_PROS_VARS_FLOATERS },
    { teamId: 'varsity.TNXL',  shortName: 'TNXL',      division: 'varsity', players: [] },
    { teamId: 'varsity.WSA',   shortName: 'WSA',       division: 'varsity', players: [] },
  ],
};
