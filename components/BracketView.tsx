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

// ─────────────────────────────────────────────────────────────────────────────
// EDIT BELOW — division hero copy. Each division gets its own subtitle so the
// brackets feel like distinct championships, all chasing the same Bell.
// ─────────────────────────────────────────────────────────────────────────────

const DIVISION_HEROES: Record<
  Division,
  { eyebrow: string; title: string; subtitle: string }
> = {
  premier: {
    eyebrow: 'ABA National Championship',
    title: 'Premier Division',
    subtitle: 'The Main Bell is on the Line',
  },
  prospect: {
    eyebrow: 'ABA National Championship',
    title: 'Prospect Division',
    subtitle: 'Ring the Bell. Earn the Title.',
  },
  varsity: {
    eyebrow: 'ABA National Championship',
    title: 'Varsity Division',
    subtitle: 'Ring the Bell. Earn the Title.',
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// END EDIT
// ─────────────────────────────────────────────────────────────────────────────

export function BracketView({ division, state, admin = false }: Props) {
  return (
    <section className="w-full">
      <DivisionHero division={division} updatedAt={state.updatedAt} />
      <div className="px-4 lg:px-6 pb-6 pt-5">
        {division === 'premier' ? (
          <PremierBracket state={state} admin={admin} />
        ) : (
          <PyramidBracket division={division} state={state} admin={admin} />
        )}
      </div>
    </section>
  );
}

function DivisionHero({
  division,
  updatedAt,
}: {
  division: Division;
  updatedAt: string;
}) {
  const hero = DIVISION_HEROES[division];
  const updatedLabel =
    updatedAt && updatedAt !== new Date(0).toISOString()
      ? `Updated ${formatRelativeTime(updatedAt)}`
      : 'Awaiting first results';

  return (
    <div className="relative overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(135deg, #06162a 0%, #0a2240 50%, #c8102e 110%)',
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 opacity-30 mix-blend-overlay"
        style={{
          background:
            'radial-gradient(circle at 25% 30%, rgba(255,255,255,0.25), transparent 60%)',
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"
      />

      <div className="relative px-4 lg:px-6 py-8 sm:py-10 max-w-screen-xl mx-auto flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <div className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] text-white/70">
            {hero.eyebrow}
          </div>
          <h1 className="mt-1.5 text-2xl sm:text-4xl font-black tracking-tight text-white leading-tight drop-shadow">
            {hero.title}
          </h1>
          <p className="mt-1 text-sm sm:text-base text-white/85 font-medium tracking-wide">
            {hero.subtitle}
          </p>
        </div>
        <p className="text-[11px] uppercase tracking-wider text-white/60 sm:self-end">
          {updatedLabel}
        </p>
      </div>
    </div>
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
