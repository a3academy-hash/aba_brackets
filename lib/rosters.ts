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

// WSA / Wellington ────────────────────────────────────────────────────────────
// Source legend: blue = Premier↔Prospect floaters, green = Prospect↔Varsity
// floaters, yellow = Varsity↔JV (ignored — JV is not in this system).
// All blue floaters appeared in the Prospect column → primaryDivision Prospect.
// All green floaters appeared in the Prospect column → primaryDivision Prospect.

const WSA_PREMIER: Player[] = [
  { name: 'Andres Rodriguez' },
  { name: 'Anthony Iaciofano' },
  { name: 'Cam McFadden' },
  { name: 'Chase Webster' },
  { name: 'Dominic Bretti' },
  { name: 'Eric Flores' },
  { name: 'Gabrian Diaz' },
  { name: 'Gabriel Soto' },
  { name: 'Gage Roof' },
  { name: 'Grady Endemann' },
  { name: 'James Dono' },
  { name: 'Lucas Bratten' },
  { name: 'Michael Donals' },
  { name: 'Peyton Warner' },
  { name: 'Rocco Castrillon' },
  { name: 'Sebastian Burnett' },
  { name: 'Slade Wayne' },
  { name: 'Thomas Glenn' },
  { name: 'Tyler Atkins' },
  { name: 'William Mencho' },
  { name: 'Zach Pollock' },
];

const WSA_PROSPECT: Player[] = [
  { name: 'Braden Alexander' },
  { name: 'David Brongo' },
  { name: 'James Paul' },
  { name: 'Joey Auricchio' },
  { name: 'Khai Gil' },
  { name: 'Liam Wallace' },
  { name: 'Michael Sanchez' },
  { name: 'Preston Applebaum' },
  { name: 'Ruben Guerrero' },
  { name: 'Tanner Kenny' },
  { name: 'Will Eaton' },
];

const WSA_VARSITY: Player[] = [
  { name: 'Adamo Scavo' },
  { name: 'Alejandro Marin' },
  { name: 'Anthony Sardinas' },
  { name: 'Balin Frerichs' },
  { name: 'Blaize Davis' },
  { name: 'Blake Jeremie' },
  { name: 'Chase Lima' },
  { name: 'Craig Arlotta' },
  { name: 'Desean Gracia' },
  { name: 'Gavin Julius' },
  { name: 'Jazz Sheppard' },
  { name: 'JJ Martinez' },
  { name: 'Johan Antigua' },
  { name: 'Kingston Wiley' },
  { name: 'Latavion Parke' },
  { name: 'Marshall Johnson' },
  { name: 'Michael Pastore' },
  { name: 'Milo Walker' },
  { name: 'Ricky Rodman' },
  { name: 'Sean McLaughlin' },
  { name: 'Trey Hamilton' },
  { name: 'Carlos Rodriguez' },
];

const WSA_PREM_PROS_FLOATERS: Player[] = [
  { name: 'Zachary Antheil', primaryDivision: 'prospect' },
  { name: 'Ethan Till',      primaryDivision: 'prospect' },
  { name: 'James Williams',  primaryDivision: 'prospect' },
  { name: 'Jorge Ferrer',    primaryDivision: 'prospect' },
  { name: 'Parker Shoup',    primaryDivision: 'prospect' },
];

const WSA_PROS_VARS_FLOATERS: Player[] = [
  { name: 'Abriel Torres',    primaryDivision: 'prospect' },
  { name: 'Carson King',      primaryDivision: 'prospect' },
  { name: 'Diego Castro',     primaryDivision: 'prospect' },
  { name: 'Liam Gencsy',      primaryDivision: 'prospect' },
  { name: 'Samuel Vatterott', primaryDivision: 'prospect' },
];

const WSA_PROSPECT_FLOATERS: Player[] = [
  ...WSA_PREM_PROS_FLOATERS,
  ...WSA_PROS_VARS_FLOATERS,
];

// Kingsmen ────────────────────────────────────────────────────────────────────
// No Premier team. The Prospect team is `prospect.Kingsmen`; the Varsity team
// is `varsity.KINGS` (different bracket IDs, same organization — see README).
// Five floaters between Prospect and Varsity, marked with asterisks on both
// source rosters. Primary division set to Prospect (the source listed each
// floater's full position / grad year on the Prospect sheet).

const KINGSMEN_PROSPECT: Player[] = [
  { name: 'Caiden McNeil' },
  { name: 'Mason Ritzema' },
  { name: 'Anthony Seminara' },
  { name: 'Jake Donaldson' },
  { name: 'Ryan Watters' },
  { name: 'Montgomery Hart' },
  { name: 'Tristan Harless' },
  { name: 'Jack Curtis' },
  { name: 'Brandon Falk' },
  { name: 'Israel Clase' },
  { name: 'Noah Entrekin' },
  { name: 'Hudson Entrekin' },
  { name: 'Kaysen Young' },
  { name: 'Micah Irving' },
  { name: 'Ashton Bowes' },
  { name: 'Angel Rary' },
  { name: 'Owen Beatrice' },
];

const KINGS_VARSITY: Player[] = [
  { name: 'Max Raley' },
  { name: 'Nehemiah Barnes' },
  { name: 'Matthew de la Cruz' },
  { name: 'Tate Johnston' },
  { name: 'Eli Thomas' },
  { name: 'Brody Weinandt' },
  { name: 'Deacon Curtis' },
  { name: 'AJ Griffith' },
];

const KINGSMEN_FLOATERS: Player[] = [
  { name: 'Logan Daniel',     primaryDivision: 'prospect' },
  { name: 'Landon Cattani',   primaryDivision: 'prospect' },
  { name: 'Jack Catron',      primaryDivision: 'prospect' },
  { name: 'Christian Burney', primaryDivision: 'prospect' },
  { name: 'Harris Clark',     primaryDivision: 'prospect' },
];

// Clubhouse ───────────────────────────────────────────────────────────────────
// Varsity only — Clubhouse's other team is JV, which is not part of this
// system. Source marked 5 Varsity↔JV floaters in bold blue; they are still
// listed in the Varsity card's floater block at the user's request, but with
// no `primaryDivision` since the adjacent team isn't modeled.

const CLUBHOUSE_VARSITY: Player[] = [
  { name: 'Brayden Aungst' },
  { name: 'Brody Birren' },
  { name: 'Elijah Birren', notes: 'IL' },
  { name: 'Braydon Cook' },
  { name: 'Caden Gillespie' },
  { name: 'Landon King' },
  { name: 'Kyler Loderbauer' },
  { name: 'Brenden Marcic' },
  { name: 'Javon Marks' },
  { name: 'Kiano Noa' },
  { name: 'Jace Pask' },
  { name: 'Caleb Rodriguez' },
  { name: 'Juilo Taveras' },
  { name: 'Maksim Kilmer' },
];

const CLUBHOUSE_FLOATERS: Player[] = [
  { name: 'Bryson Aperans' },
  { name: 'Luciano Dokoupil' },
  { name: 'Trent Jones' },
  { name: 'Brantley Skinner' },
  { name: 'Philippe Thibeault' },
];

// ECA ─────────────────────────────────────────────────────────────────────────
// Source spreadsheet has explicit "Premier to Prospect" (green) and
// "Prospect to Varsity" (yellow) columns, so floater direction is unambiguous.

const ECA_PREMIER: Player[] = [
  { name: 'Carter Adams' },
  { name: 'Lawson Tyndall' },
  { name: 'Caden Scott' },
  { name: 'Connor Radford' },
  { name: 'Miguel Delgado' },
  { name: 'Hayden Waller' },
  { name: 'Baines Raynor' },
  { name: 'Jace Jones' },
  { name: 'Will Jones' },
  { name: 'Cooper Redfern' },
  { name: 'Tanner Trevathan' },
  { name: 'Dayton Hamilton' },
];

const ECA_PROSPECT: Player[] = [
  { name: 'Thad Parker' },
  { name: 'Isaiah Cora' },
  { name: 'Jeff Newsome' },
  { name: 'Alex Hernandez' },
  { name: 'Jackson Mocny' },
  { name: 'Carson Mentlewski' },
  { name: 'Jack Cunningham' },
  { name: 'Donaven Wright' },
  { name: 'Sam Lopez' },
  { name: 'Chandler Hill' },
];

const ECA_VARSITY: Player[] = [
  { name: 'Patrick Keller' },
  { name: 'Lyric Pittman' },
  { name: 'Clark Johnson' },
  { name: 'Bryce Weeks' },
  { name: 'Alex Estevez' },
  { name: 'Chace Chrismon' },
  { name: 'Blake Wallace' },
  { name: 'Max Liriano' },
  { name: 'Teagan Nickerson' },
  { name: 'Riley Ciechoski' },
  { name: 'Ian Neuberger' },
  { name: 'Ben Reese' },
  { name: 'Easton Hart' },
  { name: 'Enmanuel Gregorio' },
  { name: 'CJ Summerlin' },
  { name: 'Max Clark' },
  { name: 'Wesley Kennedy' },
  { name: 'Hayden Herring' },
];

const ECA_PREM_PROS_FLOATERS: Player[] = [
  { name: 'Evan Johnson',  primaryDivision: 'premier' },
  { name: 'Miles Hamm',    primaryDivision: 'premier' },
  { name: 'Charlie Scott', primaryDivision: 'premier' },
  { name: 'Landen Smith',  primaryDivision: 'premier' },
  { name: 'Gabe Spears',   primaryDivision: 'premier' },
];

const ECA_PROS_VARS_FLOATERS: Player[] = [
  { name: 'Jameson Stroud', primaryDivision: 'prospect' },
  { name: 'Mack Wiggins',   primaryDivision: 'prospect' },
  { name: 'Jackson Brown',  primaryDivision: 'prospect' },
  { name: 'Noah Genna',     primaryDivision: 'prospect' },
  { name: 'Josh Parnell',   primaryDivision: 'prospect' },
];

const ECA_PROSPECT_FLOATERS: Player[] = [
  ...ECA_PREM_PROS_FLOATERS,
  ...ECA_PROS_VARS_FLOATERS,
];

// TNXL ────────────────────────────────────────────────────────────────────────
// Source labels: "Premier", "Prospect Black" (= our Prospect), "Prospect Green"
// (= our Varsity). Floaters highlighted yellow on both the Premier sheet and
// the Prospect Black sheet — all 5 are Premier↔Prospect floaters. No
// Prospect↔Varsity floaters were marked on either sheet.
//
// Primary set to Prospect: 4 of 5 floaters appear in jersey-number order on
// Prospect Black but are appended at the bottom of Premier, suggesting they
// roster on Prospect and float up. Logan Wermuth is sorted on both sheets so
// his primary is ambiguous; defaulted to Prospect to keep the group uniform.

const TNXL_PREMIER: Player[] = [
  { name: 'Zander Wills' },
  { name: 'Zach Bender' },
  { name: 'Yavier Rosendo' },
  { name: 'Alex Edisis' },
  { name: 'Holden Barco' },
  { name: 'Coleton Brady' },
  { name: 'Daniel Padilla' },
  { name: 'Nathaniel Sabino' },
  { name: 'Eddie Kennedy Jr' },
  { name: 'Danny Melendez' },
  { name: 'Cameron Hanes' },
  { name: 'Genson Veras' },
  { name: 'Will DeVinney' },
  { name: 'Kaleb Traylor' },
  { name: 'Hansel Ramirez' },
  { name: 'Daylen Linton' },
  { name: 'Landyn Elliott' },
  { name: 'Blake Davis' },
  { name: 'Spencer Evans' },
  { name: 'Carter Lenz' },
  { name: 'Tyler Ramos' },
];

const TNXL_PROSPECT: Player[] = [
  { name: 'Andres Gonzalez' },
  { name: 'Max Engstrom' },
  { name: 'Eli Harrison' },
  { name: 'Miles Wolf' },
  { name: 'Jeremy Sanchez' },
  { name: 'Cadyn Rawley' },
  { name: 'Luke Cichowski' },
  { name: 'Yamil Gonzalez' },
  { name: 'JD Howard' },
  { name: 'Tyrone Roberson' },
  { name: 'DJ Oneal' },
  { name: 'Evan Tessmer' },
  { name: 'Albert Roas Jr.' },
  { name: 'Dylan Espinal' },
  { name: 'Yaniel Jiminez' },
];

const TNXL_VARSITY: Player[] = [
  { name: 'Charlie Bello' },
  { name: 'Dylan de Leca' },
  { name: 'Ben Kent' },
  { name: 'David Hwang' },
  { name: 'Cam Smith' },
  { name: 'Noah Hopkinson' },
  { name: 'Bryan Vazquez' },
  { name: 'Justin Pascal' },
  { name: 'Reese Ainsworth' },
  { name: 'Riley Rogers' },
  { name: 'Preston Emmons' },
  { name: 'Brennan Crouch' },
  { name: 'Jack Santana' },
  { name: 'David Acevedo' },
  { name: 'Diego Rosario' },
  { name: 'Russell Hiraldo' },
  { name: 'Braden Gaffney' },
];

const TNXL_PREM_PROS_FLOATERS: Player[] = [
  { name: 'Logan Wermuth',   primaryDivision: 'prospect' },
  { name: 'Will Biggs',      primaryDivision: 'prospect' },
  { name: 'Jake Churchman',  primaryDivision: 'prospect' },
  { name: 'Diego Solorzano', primaryDivision: 'prospect' },
  { name: 'Jayden Flores',   primaryDivision: 'prospect' },
];

// A3 ─────────────────────────────────────────────────────────────────────────
// Source has separate "Floaters" blocks under Premier (5 Premier↔Prospect)
// and between Prospect/Varsity (5 Prospect↔Varsity). No explicit primary
// indicator on the Prem↔Pros set — defaulted all 5 to primary Premier.
//
// Note: Brayden Temperton was listed in BOTH the regular Prospect column AND
// the Prospect↔Varsity floater block in the source. Kept him only as a
// floater (primary Prospect) per the convention that floaters live in their
// own list, not duplicated in `players`.

const A3_PREMIER: Player[] = [
  { name: 'Sammy Echeverry' },
  { name: 'Ayson McIntosh' },
  { name: 'Kaden Kenny' },
  { name: 'Nate Roldan' },
  { name: 'Vinny Lee' },
  { name: 'Moises Gudino' },
  { name: 'Miguel Roa' },
  { name: 'Connor Fulmino' },
  { name: 'Matthew Midyett' },
  { name: 'Dillon Knight' },
  { name: 'Bryan Alonso' },
  { name: 'Grant Timmons' },
  { name: 'Hayden Sladewski' },
  { name: 'Parker Allman' },
  { name: 'Jojo Deljevic' },
  { name: 'Landon Serrano' },
  { name: 'Isaiah Welch' },
  { name: 'David Carioto' },
];

const A3_PROSPECT: Player[] = [
  { name: 'Clay Eichlin' },
  { name: 'Sebastian Echeverry' },
  { name: 'Nick Brown' },
  { name: 'Allen Soriano' },
  { name: 'Julius Jessurun' },
  { name: 'Jaden Hyde' },
  { name: 'Logan Prince' },
  { name: 'Leo Reina' },
  { name: 'Forest Pepperkorn' },
  { name: 'Austin Stalbird' },
  { name: 'Sterling Reed' },
];

const A3_VARSITY: Player[] = [
  { name: 'Heath Richardson' },
  { name: 'Dylan Kolsen' },
  { name: 'Gabe Messing' },
  { name: 'Cyprian McIntosh' },
  { name: 'Jacob Wolf' },
  { name: 'Trevarus Albury' },
  { name: 'Cooper Gunderson' },
  { name: 'Alex Diamond' },
  { name: 'Dom Kowall' },
  { name: 'Braden Giacobbe' },
  { name: 'Arthur Holland' },
  { name: 'Kaleb Dees' },
  { name: 'Daniel Darretta' },
  { name: 'Noah Reagan' },
  { name: 'Jax Nofsinger' },
];

const A3_PREM_PROS_FLOATERS: Player[] = [
  { name: 'Trent Prevatt',  primaryDivision: 'premier' },
  { name: 'Richy Marshall', primaryDivision: 'premier' },
  { name: 'Jack Hurlburt',  primaryDivision: 'premier' },
  { name: 'Jordan Combee',  primaryDivision: 'premier' },
  { name: 'JL Gomez',       primaryDivision: 'premier' },
];

const A3_PROS_VARS_FLOATERS: Player[] = [
  { name: 'Isaiah Morales',   primaryDivision: 'prospect' },
  { name: 'Brayden Temperton', primaryDivision: 'prospect' },
  { name: 'Jordan Ortiz',     primaryDivision: 'prospect' },
  { name: 'Jeyden DeJesus',   primaryDivision: 'prospect' },
  { name: 'Eric Garcia',      primaryDivision: 'prospect' },
];

const A3_PROSPECT_FLOATERS: Player[] = [
  ...A3_PREM_PROS_FLOATERS,
  ...A3_PROS_VARS_FLOATERS,
];

// ─────────────────────────────────────────────────────────────────────────────
// Master rosters map
// ─────────────────────────────────────────────────────────────────────────────

export const ROSTERS: Record<Division, Team[]> = {
  premier: [
    { teamId: 'premier.A3',   shortName: 'A3',   division: 'premier', players: A3_PREMIER, floaters: A3_PREM_PROS_FLOATERS },
    { teamId: 'premier.ECA',  shortName: 'ECA',  division: 'premier', players: ECA_PREMIER, floaters: ECA_PREM_PROS_FLOATERS },
    { teamId: 'premier.GPA',  shortName: 'GPA',  division: 'premier', players: [] },
    { teamId: 'premier.P27',  shortName: 'P27',  division: 'premier', players: P27_PREMIER, floaters: P27_PREM_PROS_FLOATERS },
    { teamId: 'premier.PDG',  shortName: 'PDG',  division: 'premier', players: PDG_PREMIER, floaters: PDG_FLOATERS },
    { teamId: 'premier.TNXL', shortName: 'TNXL', division: 'premier', players: TNXL_PREMIER, floaters: TNXL_PREM_PROS_FLOATERS },
    { teamId: 'premier.WSA',  shortName: 'WSA',  fullName: 'Wellington', division: 'premier', players: WSA_PREMIER, floaters: WSA_PREM_PROS_FLOATERS },
  ],
  prospect: [
    { teamId: 'prospect.A3',       shortName: 'A3',       division: 'prospect', players: A3_PROSPECT, floaters: A3_PROSPECT_FLOATERS },
    { teamId: 'prospect.CPCA',     shortName: 'CPCA',     division: 'prospect', players: [] },
    { teamId: 'prospect.DSC',      shortName: 'DSC',      division: 'prospect', players: [] },
    { teamId: 'prospect.ECA',      shortName: 'ECA',      division: 'prospect', players: ECA_PROSPECT, floaters: ECA_PROSPECT_FLOATERS },
    { teamId: 'prospect.GPA',      shortName: 'GPA',      division: 'prospect', players: [] },
    { teamId: 'prospect.Kingsmen', shortName: 'Kingsmen', division: 'prospect', players: KINGSMEN_PROSPECT, floaters: KINGSMEN_FLOATERS },
    { teamId: 'prospect.P27',      shortName: 'P27',      division: 'prospect', players: P27_PROSPECT, floaters: P27_PROSPECT_FLOATERS },
    { teamId: 'prospect.PDG',      shortName: 'PDG',      division: 'prospect', players: PDG_PROSPECT, floaters: PDG_FLOATERS },
    { teamId: 'prospect.TNXL',     shortName: 'TNXL',     division: 'prospect', players: TNXL_PROSPECT, floaters: TNXL_PREM_PROS_FLOATERS },
    { teamId: 'prospect.WSA',      shortName: 'WSA',      fullName: 'Wellington', division: 'prospect', players: WSA_PROSPECT, floaters: WSA_PROSPECT_FLOATERS },
  ],
  varsity: [
    { teamId: 'varsity.A3',    shortName: 'A3',        division: 'varsity', players: A3_VARSITY, floaters: A3_PROS_VARS_FLOATERS },
    { teamId: 'varsity.CLUB',  shortName: 'Clubhouse', division: 'varsity', players: CLUBHOUSE_VARSITY, floaters: CLUBHOUSE_FLOATERS },
    { teamId: 'varsity.CPCA',  shortName: 'CPCA',      division: 'varsity', players: [] },
    { teamId: 'varsity.ECA',   shortName: 'ECA',       division: 'varsity', players: ECA_VARSITY, floaters: ECA_PROS_VARS_FLOATERS },
    { teamId: 'varsity.FTB',   shortName: 'FTB',       division: 'varsity', players: [] },
    { teamId: 'varsity.GPA',   shortName: 'GPA',       division: 'varsity', players: [] },
    { teamId: 'varsity.KINGS', shortName: 'KINGS',     fullName: 'Kingsmen',   division: 'varsity', players: KINGS_VARSITY, floaters: KINGSMEN_FLOATERS },
    { teamId: 'varsity.P27',   shortName: 'P27',       division: 'varsity', players: P27_VARSITY, floaters: P27_PROS_VARS_FLOATERS },
    { teamId: 'varsity.TNXL',  shortName: 'TNXL',      division: 'varsity', players: TNXL_VARSITY },
    { teamId: 'varsity.WSA',   shortName: 'WSA',       fullName: 'Wellington', division: 'varsity', players: WSA_VARSITY, floaters: WSA_PROS_VARS_FLOATERS },
  ],
};
