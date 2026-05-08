import { PremierBracket } from './PremierBracket';
import { PyramidBracket } from './PyramidBracket';
import type { Division, DivisionState } from '@/lib/types';

type Props = {
  division: Division;
  state: DivisionState;
  admin?: boolean;
};

const DIVISION_NAMES: Record<Division, string> = {
  premier: 'Premier',
  prospect: 'Prospect',
  varsity: 'Varsity',
};

export function BracketView({ division, state, admin = false }: Props) {
  return (
    <section className="w-full">
      <header className="mb-2 flex items-baseline justify-between px-4 lg:px-6">
        <h2 className="text-xl font-bold text-navy">{DIVISION_NAMES[division]}</h2>
        <p className="text-xs text-muted">
          {state.updatedAt && state.updatedAt !== new Date(0).toISOString()
            ? `Updated ${formatRelativeTime(state.updatedAt)}`
            : 'Awaiting first results'}
        </p>
      </header>

      <div className="px-4 lg:px-6 pb-6">
        {division === 'premier' ? (
          <PremierBracket state={state} admin={admin} />
        ) : (
          <PyramidBracket division={division} state={state} admin={admin} />
        )}
      </div>
    </section>
  );
}

function formatRelativeTime(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  if (ms < 60 * 1000) return 'just now';
  const min = Math.floor(ms / 60000);
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.floor(hr / 24);
  return `${day}d ago`;
}
