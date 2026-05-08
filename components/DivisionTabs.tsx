import Link from 'next/link';
import { DIVISIONS } from '@/lib/types';
import type { Division } from '@/lib/types';

export type TabKey = Division | 'grid';
export const TAB_KEYS: readonly TabKey[] = [...DIVISIONS, 'grid'] as const;

const TAB_NAMES: Record<TabKey, string> = {
  premier: 'Premier',
  prospect: 'Prospect',
  varsity: 'Varsity',
  grid: 'Grid',
};

type Props = {
  active: TabKey;
  /** path prefix for the link href (e.g. "/" or "/admin") */
  basePath?: string;
};

export function DivisionTabs({ active, basePath = '/' }: Props) {
  return (
    <nav
      className="sticky top-0 z-20 bg-white/95 backdrop-blur border-b border-navy/10"
      aria-label="Division"
    >
      <div className="max-w-screen-2xl mx-auto flex">
        {TAB_KEYS.map((d) => {
          const isActive = d === active;
          const href = `${basePath}${basePath.endsWith('/') ? '' : '/'}?d=${d}`;
          return (
            <Link
              key={d}
              href={href}
              prefetch={false}
              className={[
                'flex-1 text-center py-3 px-4 text-sm font-semibold tap-target transition',
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
