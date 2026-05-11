// ─────────────────────────────────────────────────────────────────────────────
// EDIT BELOW — content sourced from docs/ABA Rules Quick Sheet (2).pdf, pages
// 1–2. Phrasing has been smoothed for clarity (typos fixed, full sentences,
// consistent structure) without changing the substance of any rule. To edit a
// rule, find its block below and update it; layout components below the data.
// ─────────────────────────────────────────────────────────────────────────────

const HERO = {
  eyebrow: 'Quick Reference',
  title: 'ABA Game Rules',
  subtitle: 'The ABA plays by NFHS rules with the modifications below.',
};

type Pair = [label: string, body: string];

type Rule =
  | { kind: 'pairs';      title: string; intro?: string; pairs: Pair[] }
  | { kind: 'bullets';    title: string; intro?: string; bullets: string[]; outro?: string }
  | { kind: 'paragraph';  title: string; body: string }
  | { kind: 'dugout';     title: string; intro: string; bullets: string[]; outro: string }
  | { kind: 'tiers';      title: string; intro: string }
  | { kind: 'coachEjections'; title: string; lines: string[] };

const RULES: Rule[] = [
  {
    kind: 'pairs',
    title: 'Time Limits',
    pairs: [
      ['Varsity', '2.5-hour time limit before the tiebreaker starts. Game ends at 7 innings or 2.5 hours, whichever comes first.'],
      ['Premier & Prospect', 'No time limit (unless inclement weather).'],
    ],
  },
  {
    kind: 'paragraph',
    title: 'Home Team',
    body:
      'The home team will be the higher seed throughout the tournament, except in the championship game(s), where the winner’s bracket team will be the home team.',
  },
  {
    kind: 'pairs',
    title: 'Tiebreakers / Extra Innings',
    pairs: [
      ['Premier', 'Straight up.'],
      ['Prospect & Varsity', 'Bases loaded, 1 out.'],
    ],
  },
  {
    kind: 'bullets',
    title: 'Run Rule (All Divisions)',
    bullets: [
      '15 runs after 3 innings',
      '12 runs after 4 innings',
      '10 runs after 5 innings',
    ],
  },
  {
    kind: 'pairs',
    title: 'Courtesy Runners',
    pairs: [
      ['Premier', 'Not permitted.'],
      ['All other divisions', 'The last batted out may run for the pitcher or catcher.'],
    ],
  },
  {
    kind: 'pairs',
    title: 'Batting Lineup Maximum',
    pairs: [
      ['Premier', '10'],
      ['Prospect', '11'],
      ['Varsity / JV / MS', '12'],
    ],
  },
  {
    kind: 'pairs',
    title: 'Re-entry',
    pairs: [
      ['Premier', 'No re-entry.'],
      [
        'All other divisions',
        'NFHS rule. Players in the starting lineup may re-enter once. Players who start on the bench may enter the game, but cannot re-enter once subbed out — and once subbed out, they can no longer courtesy run or take any other in-game role.',
      ],
    ],
  },
  {
    kind: 'paragraph',
    title: '3B to 1B Pickoff Move',
    body: 'Not permitted.',
  },
  {
    kind: 'bullets',
    title: 'Mound Visits',
    intro: '3 per game. You can take all 3 whenever you want — including all 3 in the same inning.',
    bullets: [
      'A pitching change does NOT count as a mound visit.',
      'Catcher and position-player visits do NOT count as mound visits.',
      'You do NOT have to remove a pitcher on the 2nd or 3rd visit in the same inning, as long as you still have visits remaining.',
    ],
  },
  {
    kind: 'paragraph',
    title: 'Hit by Pitch (HBP)',
    body: 'NFHS rules. Essentially: you can roll into a pitch as long as you aren’t over the plate.',
  },
  {
    kind: 'paragraph',
    title: 'Balks',
    body: 'Live ball.',
  },
  {
    kind: 'paragraph',
    title: 'EH (Extra Hitter)',
    body: 'You can freely substitute any position on the diamond, and the EH can “roam.”',
  },
  {
    kind: 'dugout',
    title: 'Other Teams in the Dugout',
    intro:
      'Players from other teams in the same organization are permitted in the dugout during games, provided they are in full uniform and follow these rules:',
    bullets: [
      'Stay in the dugout. No movement onto the field, fence line, or stands during play.',
      'Direct all energy at supporting your own team. Cheers, chants, and encouragement must target teammates or be neutral game chants — not opposing players, coaches, or umpires.',
      'Keep it in good faith. No obscenities, no taunting, no targeting opposing players with chants or verbiage.',
    ],
    outro:
      'Violations: the entire team is removed from the dugout for the rest of the game. Repeat violations may result in tier-based ejection penalties.',
  },
  {
    kind: 'tiers',
    title: 'Player Ejections — Tier System',
    intro:
      'Disciplinary action is based on a tier system. Umpires submit post-game ejection reports to the league.',
  },
  {
    kind: 'coachEjections',
    title: 'Coach Ejections',
    lines: [
      '1st ejection in a season: No fine.',
      '2nd ejection in a season: $100 fine + 1-game suspension. Fine must be paid in full before the next game coached.',
      '3rd ejection in a season: $500 fine + 3-game suspension. Fine must be paid in full before the next game coached.',
    ],
  },
];

type Tier = { name: string; tone: 'red' | 'amber' | 'navy'; suspension: string; examples: string };

const TIERS: Tier[] = [
  {
    name: 'Tier 1 (Red)',
    tone: 'red',
    suspension: 'That game + 2 additional games',
    examples:
      'Fighting, shoving, or any physical altercation with intent to harm. Umpire deems the player intentionally threw at a batter, or escalation after a warning was issued during a heated game.',
  },
  {
    name: 'Tier 2',
    tone: 'amber',
    suspension: 'That game + 1 additional game',
    examples:
      'Egregious dirty play or ignoring of warnings. Over-the-top collisions, blatant spikes-up sliding, ongoing emotional outbursts longer than a quick shout, conduct embarrassing to the league. A player officially warned to stop a particular action (such as bench jockeying) who continues anyway.',
  },
  {
    name: 'Tier 3',
    tone: 'navy',
    suspension: 'That game only',
    examples:
      'Quick verbal shouts. Heat-of-the-moment F-bombs. Quick umpire triggers without warning. Arguing balls and strikes. Saying something walking back to the dugout. Bench-jockeying ejection without warning.',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// END EDIT — layout below.
// ─────────────────────────────────────────────────────────────────────────────

export function Rules() {
  return (
    <section className="w-full">
      <Hero />
      <div className="px-4 lg:px-6 py-10 max-w-screen-xl mx-auto">
        <div className="grid gap-5 lg:grid-cols-2">
          {RULES.map((rule, i) => (
            <RuleCard key={i} rule={rule} index={i + 1} />
          ))}
        </div>
        <p className="mt-8 text-center text-[11px] uppercase tracking-wider text-muted">
          Source: ABA Rules Quick Sheet · NFHS rules apply unless noted.
        </p>
      </div>
    </section>
  );
}

// ── hero ─────────────────────────────────────────────────────────────────────

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
      <div className="relative px-4 lg:px-6 py-10 sm:py-14 max-w-screen-xl mx-auto">
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

// ── rule card dispatcher ─────────────────────────────────────────────────────

function RuleCard({ rule, index }: { rule: Rule; index: number }) {
  return (
    <article className="rounded-lg border border-navy/15 bg-white shadow-sm p-5 sm:p-6 flex flex-col gap-3">
      <header className="flex items-baseline gap-3">
        <span className="shrink-0 inline-flex items-center justify-center w-7 h-7 rounded-full bg-aba-red text-white text-[12px] font-bold tabular-nums">
          {index}
        </span>
        <h2 className="text-lg sm:text-xl font-bold text-navy leading-tight">
          {rule.title}
        </h2>
      </header>
      <RuleBody rule={rule} />
    </article>
  );
}

function RuleBody({ rule }: { rule: Rule }) {
  switch (rule.kind) {
    case 'paragraph':
      return <p className="text-[14px] leading-relaxed text-navy/90">{rule.body}</p>;

    case 'pairs':
      return (
        <div className="space-y-2">
          {rule.intro ? <p className="text-[14px] text-navy/90 leading-relaxed">{rule.intro}</p> : null}
          <dl className="space-y-1.5">
            {rule.pairs.map(([label, body], i) => (
              <div key={i} className="grid grid-cols-[auto_1fr] gap-x-3">
                <dt className="text-[12px] font-bold uppercase tracking-wider text-aba-red whitespace-nowrap pt-0.5">
                  {label}
                </dt>
                <dd className="text-[14px] leading-relaxed text-navy/90">{body}</dd>
              </div>
            ))}
          </dl>
        </div>
      );

    case 'bullets':
      return (
        <div className="space-y-2">
          {rule.intro ? <p className="text-[14px] text-navy/90 leading-relaxed">{rule.intro}</p> : null}
          <ul className="space-y-1.5">
            {rule.bullets.map((b, i) => (
              <li key={i} className="flex gap-2 text-[14px] leading-relaxed text-navy/90">
                <span className="shrink-0 mt-2 w-1.5 h-1.5 rounded-full bg-aba-red" aria-hidden />
                <span>{b}</span>
              </li>
            ))}
          </ul>
          {rule.outro ? <p className="text-[14px] text-navy/90 leading-relaxed">{rule.outro}</p> : null}
        </div>
      );

    case 'dugout':
      return (
        <div className="space-y-2.5">
          <p className="text-[14px] text-navy/90 leading-relaxed">{rule.intro}</p>
          <ul className="space-y-1.5">
            {rule.bullets.map((b, i) => (
              <li key={i} className="flex gap-2 text-[14px] leading-relaxed text-navy/90">
                <span className="shrink-0 mt-2 w-1.5 h-1.5 rounded-full bg-aba-red" aria-hidden />
                <span>{b}</span>
              </li>
            ))}
          </ul>
          <p className="text-[13px] text-aba-red font-semibold leading-relaxed border-t border-navy/10 pt-2.5 mt-2">
            {rule.outro}
          </p>
        </div>
      );

    case 'tiers':
      return <TiersTable intro={rule.intro} />;

    case 'coachEjections':
      return (
        <ol className="space-y-1.5">
          {rule.lines.map((line, i) => (
            <li key={i} className="flex gap-2 text-[14px] leading-relaxed text-navy/90">
              <span className="shrink-0 inline-flex items-center justify-center w-5 h-5 rounded-full bg-navy text-white text-[10px] font-bold tabular-nums mt-0.5">
                {i + 1}
              </span>
              <span>{line}</span>
            </li>
          ))}
        </ol>
      );
  }
}

// ── special: tier table ──────────────────────────────────────────────────────

function TiersTable({ intro }: { intro: string }) {
  const TONE: Record<Tier['tone'], { dot: string; chip: string }> = {
    red:   { dot: 'bg-aba-red',     chip: 'bg-aba-red text-white' },
    amber: { dot: 'bg-amber-500',   chip: 'bg-amber-500 text-white' },
    navy:  { dot: 'bg-navy',        chip: 'bg-navy text-white' },
  };
  return (
    <div className="space-y-3">
      <p className="text-[14px] text-navy/90 leading-relaxed">{intro}</p>
      <div className="space-y-2.5">
        {TIERS.map((tier) => (
          <div
            key={tier.name}
            className="rounded-md border border-navy/10 overflow-hidden"
          >
            <div className="flex items-center justify-between px-3 py-1.5 bg-navy/5">
              <span className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${TONE[tier.tone].dot}`} aria-hidden />
                <span className="text-[12px] font-bold uppercase tracking-wider text-navy">
                  {tier.name}
                </span>
              </span>
              <span className={`text-[10px] font-bold uppercase tracking-wider rounded px-2 py-0.5 ${TONE[tier.tone].chip}`}>
                {tier.suspension}
              </span>
            </div>
            <p className="px-3 py-2 text-[13px] leading-relaxed text-navy/85">
              {tier.examples}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
