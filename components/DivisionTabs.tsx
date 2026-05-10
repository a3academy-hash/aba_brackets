'use client';

import Link from 'next/link';
import { useState } from 'react';
import { DIVISIONS } from '@/lib/types';
import type { Division } from '@/lib/types';

export type TabKey = 'derby' | 'bell' | Division | 'rosters' | 'grid' | 'rules';
// Order matters — first key is the default tab when no ?d= is provided.
export const TAB_KEYS: readonly TabKey[] = [
  'derby',
  'bell',
  ...DIVISIONS,
  'rosters',
  'grid',
  'rules',
] as const;

const TAB_NAMES: Record<TabKey, string> = {
  derby: 'Home Run Derby',
  bell: 'Championship Bell',
  premier: 'Premier',
  prospect: 'Prospect',
  varsity: 'Varsity',
  rosters: 'Rosters',
  grid: 'Grid',
  rules: 'Rules',
};

type Props = {
  active: TabKey;
  /** path prefix for the link href (e.g. "/" or "/admin") */
  basePath?: string;
};

export function DivisionTabs({ active, basePath = '/' }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const linkFor = (d: TabKey) =>
    `${basePath}${basePath.endsWith('/') ? '' : '/'}?d=${d}`;

  return (
    <nav
      className="sticky top-0 z-20 bg-white/95 backdrop-blur border-b border-navy/10"
      aria-label="Section"
    >
      {/* Mobile: header bar with current section + hamburger */}
      <div className="md:hidden">
        <div className="flex items-center justify-between px-4 py-2">
          <span className="text-sm font-semibold text-aba-red">
            {TAB_NAMES[active]}
          </span>
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="tap-target inline-flex items-center justify-center rounded-md text-navy hover:bg-navy/5 px-2"
            aria-expanded={menuOpen}
            aria-controls="primary-nav"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            {menuOpen ? <CloseIcon /> : <BurgerIcon />}
          </button>
        </div>
        {menuOpen ? (
          <ul
            id="primary-nav"
            className="border-t border-navy/10 bg-white flex flex-col"
          >
            {TAB_KEYS.map((d) => {
              const isActive = d === active;
              return (
                <li key={d}>
                  <Link
                    href={linkFor(d)}
                    prefetch={false}
                    onClick={() => setMenuOpen(false)}
                    className={[
                      'block px-4 py-3 text-sm font-semibold tap-target border-l-4 transition',
                      isActive
                        ? 'text-aba-red border-aba-red bg-aba-red/5'
                        : 'text-navy/80 border-transparent hover:bg-navy/5',
                    ].join(' ')}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {TAB_NAMES[d]}
                  </Link>
                </li>
              );
            })}
          </ul>
        ) : null}
      </div>

      {/* Desktop: horizontal tabs */}
      <div className="hidden md:flex max-w-screen-2xl mx-auto">
        {TAB_KEYS.map((d) => {
          const isActive = d === active;
          return (
            <Link
              key={d}
              href={linkFor(d)}
              prefetch={false}
              className={[
                'flex-1 text-center py-3 px-3 text-sm font-semibold tap-target transition',
                'border-b-[3px]',
                isActive
                  ? 'text-aba-red border-aba-red'
                  : 'text-navy/70 border-transparent hover:text-navy hover:bg-navy/5',
              ].join(' ')}
              aria-current={isActive ? 'page' : undefined}
            >
              {TAB_NAMES[d]}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

function BurgerIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      aria-hidden
    >
      <line x1="4" y1="7" x2="20" y2="7" />
      <line x1="4" y1="12" x2="20" y2="12" />
      <line x1="4" y1="17" x2="20" y2="17" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      aria-hidden
    >
      <line x1="6" y1="6" x2="18" y2="18" />
      <line x1="18" y1="6" x2="6" y2="18" />
    </svg>
  );
}
