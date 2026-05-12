import { DIVISIONS } from './types';
import type { Division } from './types';

// Shared tab definitions used by both the server pages (for URL → tab parsing)
// and the client `<DivisionTabs>` component (for rendering). Lives here — not
// inside the client component file — because non-component exports from a
// 'use client' module are not callable on the server.

export type TabKey = 'derby' | 'bell' | Division | 'rosters' | 'grid' | 'rules';

// Order matters — first key is the default tab when no ?d= is provided.
export const TAB_KEYS: readonly TabKey[] = [
  'grid',
  'bell',
  ...DIVISIONS,
  'rosters',
  'rules',
  'derby',
] as const;

export const TAB_NAMES: Record<TabKey, string> = {
  derby: 'Home Run Derby',
  bell: 'Championship Bell',
  premier: 'Premier',
  prospect: 'Prospect',
  varsity: 'Varsity',
  jv: 'JV',
  rosters: 'Rosters',
  grid: 'Grid',
  rules: 'Rules',
};
