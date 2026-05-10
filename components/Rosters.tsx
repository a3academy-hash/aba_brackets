import { DIVISIONS } from '@/lib/types';
import type { Division } from '@/lib/types';
import { DIVISION_LABEL, ROSTERS, type Player, type Team } from '@/lib/rosters';

const HERO = {
  eyebrow: 'Tournament Rosters',
  title: 'Team Rosters',
  subtitle:
    'Rosters by division. Floaters — players eligible to play in an adjacent division — are tagged on each card.',
};

export function Rosters() {
  return (
    <section className="w-full">
      <Hero />
      <div className="px-4 lg:px-6 py-8 max-w-screen-2xl mx-auto space-y-10">
        <FloaterLegend />
        {DIVISIONS.map((division) => (
          <DivisionSection key={division} division={division} teams={ROSTERS[division]} />
        ))}
      </div>
    </section>
  );
}

function Hero() {
  return (
    <div className="relative overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, #06162a 0%, #0a2240 50%, #c8102e 110%)',
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
      <div className="relative px-4 lg:px-6 py-10 sm:py-14 max-w-screen-2xl mx-auto">
        <div className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] text-white/70">
          {HERO.eyebrow}
        </div>
        <h1 className="mt-1.5 text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight drop-shadow">
          {HERO.title}
        </h1>
        <p className="mt-2 text-sm sm:text-base text-white/85 font-medium tracking-wide max-w-2xl">
          {HERO.subtitle}
        </p>
      </div>
    </div>
  );
}

function FloaterLegend() {
  return (
    <div className="rounded-lg border border-navy/15 bg-white p-4 sm:p-5 shadow-sm">
      <h2 className="text-sm font-bold uppercase tracking-wider text-navy">
        About Floaters
      </h2>
      <p className="mt-2 text-[14px] leading-relaxed text-navy/85">
        A floater is a player who can play in two adjacent divisions —
        Premier↔Prospect or Prospect↔Varsity. Premier and Varsity are not
        adjacent, so floaters cannot cross between them. Each team is allowed
        up to 5 floaters.
      </p>
    </div>
  );
}

function DivisionSection({ division, teams }: { division: Division; teams: Team[] }) {
  return (
    <section aria-labelledby={`roster-${division}`} className="space-y-4">
      <header className="flex items-baseline justify-between gap-3 border-b border-navy/10 pb-2">
        <h2
          id={`roster-${division}`}
          className="text-2xl sm:text-3xl font-black tracking-tight text-navy"
        >
          {DIVISION_LABEL[division]}
        </h2>
        <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-muted">
          {teams.length} {teams.length === 1 ? 'team' : 'teams'}
        </span>
      </header>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {teams.map((team) => (
          <TeamCard key={team.teamId} team={team} />
        ))}
      </div>
    </section>
  );
}

function TeamCard({ team }: { team: Team }) {
  const display = team.fullName ?? team.shortName;
  const floaters = team.players.filter((p) => p.isFloater);
  const regulars = team.players.filter((p) => !p.isFloater);
  const hasRoster = team.players.length > 0;

  return (
    <article className="rounded-lg border border-navy/15 bg-white shadow-sm overflow-hidden flex flex-col">
      <header className="px-4 py-3 bg-navy text-white flex items-center justify-between">
        <h3 className="text-base font-bold tracking-tight">{display}</h3>
        <span className="text-[10px] font-bold uppercase tracking-wider text-white/70">
          {team.shortName}
        </span>
      </header>
      <div className="p-4 flex-1">
        {hasRoster ? (
          <div className="space-y-4">
            {regulars.length > 0 ? (
              <PlayerList players={regulars} />
            ) : null}
            {floaters.length > 0 ? (
              <FloaterList players={floaters} />
            ) : null}
            <RosterSummary team={team} />
          </div>
        ) : (
          <RosterPending />
        )}
      </div>
    </article>
  );
}

function PlayerList({ players }: { players: Player[] }) {
  return (
    <ul className="space-y-1">
      {players.map((p, i) => (
        <PlayerRow key={`${p.name}-${i}`} player={p} />
      ))}
    </ul>
  );
}

function FloaterList({ players }: { players: Player[] }) {
  return (
    <div className="rounded-md border border-aba-red/30 bg-aba-red/5 p-3">
      <div className="text-[11px] font-bold uppercase tracking-wider text-aba-red mb-1.5">
        Floaters · {players.length}
      </div>
      <ul className="space-y-1">
        {players.map((p, i) => (
          <PlayerRow key={`${p.name}-${i}`} player={p} highlightFloater />
        ))}
      </ul>
    </div>
  );
}

function PlayerRow({ player, highlightFloater }: { player: Player; highlightFloater?: boolean }) {
  const number =
    player.jerseyNumber !== undefined && player.jerseyNumber !== ''
      ? `#${player.jerseyNumber}`
      : null;
  return (
    <li className="flex items-baseline gap-2 text-[13.5px] leading-snug text-navy/90">
      {number ? (
        <span className="shrink-0 inline-block w-9 text-right tabular-nums font-semibold text-navy/60">
          {number}
        </span>
      ) : (
        <span className="shrink-0 w-9" aria-hidden />
      )}
      <span className="flex-1">
        <span className="font-medium">{player.name}</span>
        {player.position ? (
          <span className="text-navy/55"> · {player.position}</span>
        ) : null}
        {highlightFloater && player.floatTo ? (
          <span className="ml-1.5 text-[10px] font-bold uppercase tracking-wider text-aba-red">
            ↕ {player.floatTo}
          </span>
        ) : null}
        {player.notes ? (
          <span className="block text-[12px] text-muted">{player.notes}</span>
        ) : null}
      </span>
    </li>
  );
}

function RosterSummary({ team }: { team: Team }) {
  const total = team.players.length;
  const floaters = team.players.filter((p) => p.isFloater).length;
  return (
    <div className="border-t border-navy/10 pt-2 text-[11px] font-semibold uppercase tracking-wider text-muted flex items-center justify-between">
      <span>{total} players</span>
      <span>{floaters} floater{floaters === 1 ? '' : 's'}</span>
    </div>
  );
}

function RosterPending() {
  return (
    <div className="text-center py-6">
      <div className="text-[11px] font-bold uppercase tracking-wider text-muted">
        Roster Pending
      </div>
      <p className="mt-1 text-[13px] text-navy/70">
        Roster will be posted as soon as it is standardized.
      </p>
    </div>
  );
}
