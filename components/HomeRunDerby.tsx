// ─────────────────────────────────────────────────────────────────────────────
// EDIT BELOW — placeholder content for the 2026 Tag Team Home Run Derby.
// Everything in this block is plain data; swap in the real list when received.
// The layout below ("LAYOUT" section) reads from these arrays.
// ─────────────────────────────────────────────────────────────────────────────

const HERO = {
  title: '2026 ABA Tag Team Home Run Derby',
  subtitle: 'Monday Night at LakePoint  |  Championship Bell on the Line',
  // Drop a real image into /public and put the path here, e.g. '/derby-hero.jpg'.
  // Leave null to keep the gradient placeholder.
  imageSrc: null as string | null,
};

type Participant = {
  order: number;
  academy: string;
  player1: string;
  player2: string;
};

// Source: docs/ABA Open Team Operations - HR Derby.csv. Order = batting order.
const PARTICIPANTS: Participant[] = [
  { order: 1,  academy: 'Clubhouse',  player1: 'Brendan Marcic',     player2: 'CJ Gillespie'      },
  { order: 2,  academy: 'FTB',        player1: 'Carter Rivera',      player2: 'Zak Sadiki'        },
  { order: 3,  academy: 'WSA',        player1: 'Rocco Castrillon',   player2: 'Mikey Donals'      },
  { order: 4,  academy: 'Kingsmen',   player1: 'Israel Clase',       player2: 'Christian Burney'  },
  { order: 5,  academy: 'ECA',        player1: 'Lawson Tyndall',     player2: 'Miguel Delgado'    },
  { order: 6,  academy: 'PDG',        player1: 'Mason Miller',       player2: 'Jerome Fortier'    },
  { order: 7,  academy: 'DSC',        player1: 'Mekhi Bullock',      player2: 'Tyson Penepacker'  },
  { order: 8,  academy: 'CPCA',       player1: 'Aemed Nasser',       player2: 'Sebastian Rolon'   },
  { order: 9,  academy: 'GA Premier', player1: 'Yonathan Ramirez',   player2: 'Enyer Infante'     },
  { order: 10, academy: 'A3',         player1: 'Sebastian Echeverry', player2: 'Connor Fulmino'   },
  { order: 11, academy: 'P27',        player1: 'Bryce Mucica',       player2: 'Henkel Acevedo'    },
  { order: 12, academy: 'TNXL',       player1: 'Daniel Melendez',    player2: 'Alex Edisis'       },
];

const RULES: string[] = [
  'This is the 2026 ABA Tag Team Home Run Derby.',
  'Each academy is represented by a two-player tag team.',
  'Each team gets one 3-minute round.',
  'The clock is nonstop. No timeouts.',
  'Players may tag in and out as often as they want.',
  'Each team must tag/swap hitters at least once during the round.',
  'The tag/swap is part of the strategy. Teams should move quickly and treat it like a race against the clock.',
  'Coach pitch only. No pitching machines.',
  'Each academy must provide its own pitcher for its hitters.',
  'Each academy must provide its own catcher, fully in catcher’s gear.',
  'The team with the most home runs wins.',
  'The winning team earns the ABA Championship Bell.',
  'If the batter makes contact before the buzzer, the result of that batted ball counts.',
  'If the ball is still traveling toward the plate when the buzzer sounds and has not been contacted yet, it does not count.',
  'Players in the outfield may shag balls, but they may not rob home runs or attempt to bring balls back from over the fence.',
  'One league representative will keep the official clock.',
  'One league representative will announce/track the official home run total.',
];

const HYPE_RULES: string[] = [
  'Each tag team may have its Premier team on the field while they are hitting.',
  'Hype teammates may celebrate, bring energy, and support their hitters.',
  'Once that academy’s round ends, their hype team must clear the field quickly.',
  'Only the active academy’s hype team should be on the field during that round.',
  'Non-active teams should stay off the field unless assigned to shag or retrieve home run balls.',
];

type RotationRow = {
  battingTeam: string;
  hitters: string;
  shagTeam: string;
  retrievalTeam: string;
  hypeTeam: string;
};

// Source: docs/ABA Open Team Operations - HR Derby.csv.
//   shagTeam      = "Shag - Warning Track" column
//   retrievalTeam = "Shag - Over Fence" column
//   hypeTeam      = "Hype - On Field" column (= the batting academy itself)
const ROTATION: RotationRow[] = [
  { battingTeam: 'Clubhouse',  hitters: 'Brendan Marcic / CJ Gillespie',       shagTeam: 'FTB',        retrievalTeam: 'WSA',        hypeTeam: 'Clubhouse'  },
  { battingTeam: 'FTB',        hitters: 'Carter Rivera / Zak Sadiki',          shagTeam: 'WSA',        retrievalTeam: 'Kingsmen',   hypeTeam: 'FTB'        },
  { battingTeam: 'WSA',        hitters: 'Rocco Castrillon / Mikey Donals',     shagTeam: 'Kingsmen',   retrievalTeam: 'ECA',        hypeTeam: 'WSA'        },
  { battingTeam: 'Kingsmen',   hitters: 'Israel Clase / Christian Burney',     shagTeam: 'ECA',        retrievalTeam: 'PDG',        hypeTeam: 'Kingsmen'   },
  { battingTeam: 'ECA',        hitters: 'Lawson Tyndall / Miguel Delgado',     shagTeam: 'PDG',        retrievalTeam: 'DSC',        hypeTeam: 'ECA'        },
  { battingTeam: 'PDG',        hitters: 'Mason Miller / Jerome Fortier',       shagTeam: 'DSC',        retrievalTeam: 'CPCA',       hypeTeam: 'PDG'        },
  { battingTeam: 'DSC',        hitters: 'Mekhi Bullock / Tyson Penepacker',    shagTeam: 'CPCA',       retrievalTeam: 'GA Premier', hypeTeam: 'DSC'        },
  { battingTeam: 'CPCA',       hitters: 'Aemed Nasser / Sebastian Rolon',      shagTeam: 'GA Premier', retrievalTeam: 'A3',         hypeTeam: 'CPCA'       },
  { battingTeam: 'GA Premier', hitters: 'Yonathan Ramirez / Enyer Infante',    shagTeam: 'A3',         retrievalTeam: 'P27',        hypeTeam: 'GA Premier' },
  { battingTeam: 'A3',         hitters: 'Sebastian Echeverry / Connor Fulmino', shagTeam: 'P27',       retrievalTeam: 'TNXL',       hypeTeam: 'A3'         },
  { battingTeam: 'P27',        hitters: 'Bryce Mucica / Henkel Acevedo',       shagTeam: 'TNXL',       retrievalTeam: 'Clubhouse',  hypeTeam: 'P27'        },
  { battingTeam: 'TNXL',       hitters: 'Daniel Melendez / Alex Edisis',       shagTeam: 'Clubhouse',  retrievalTeam: 'FTB',        hypeTeam: 'TNXL'       },
];

// ─────────────────────────────────────────────────────────────────────────────
// END EDIT — layout below.
// ─────────────────────────────────────────────────────────────────────────────

export function HomeRunDerby() {
  return (
    <section className="w-full">
      <Hero />
      <div className="px-4 lg:px-6 py-6 space-y-8 max-w-screen-xl mx-auto">
        <ParticipantsSection />
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <RulesCard />
          </div>
          <HypeRulesCard />
        </div>
        <RotationGrid />
      </div>
    </section>
  );
}

// ── hero ─────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <div className="relative overflow-hidden">
      {HERO.imageSrc ? (
        // Replace with a real photo when available.
        // Layered overlay keeps the title legible over any image.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={HERO.imageSrc}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(135deg, #06162a 0%, #0a2240 40%, #c8102e 100%)',
          }}
        />
      )}

      {/* Subtle texture / vignette */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-30 mix-blend-overlay"
        style={{
          background:
            'radial-gradient(circle at 30% 20%, rgba(255,255,255,0.25), transparent 60%)',
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"
      />

      <div className="relative px-4 lg:px-6 py-16 sm:py-24 max-w-screen-xl mx-auto">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur border border-white/30 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-white">
          <span className="w-2 h-2 rounded-full bg-aba-red animate-pulse" aria-hidden />
          Monday Night Spotlight
        </div>
        <h1 className="mt-4 text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.05] drop-shadow-md">
          {HERO.title}
        </h1>
        <p className="mt-3 text-sm sm:text-base lg:text-lg text-white/90 font-medium tracking-wide">
          {HERO.subtitle}
        </p>
      </div>
    </div>
  );
}

// ── section header ───────────────────────────────────────────────────────────

function SectionHeader({
  eyebrow,
  title,
}: {
  eyebrow: string;
  title: string;
}) {
  return (
    <header className="mb-3">
      <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-aba-red">
        {eyebrow}
      </div>
      <h2 className="text-2xl font-bold text-navy leading-tight">{title}</h2>
    </header>
  );
}

// ── section 1: participants ──────────────────────────────────────────────────

function ParticipantsSection() {
  return (
    <section>
      <SectionHeader eyebrow="Section 1" title="Participants & Batting Order" />
      <div className="overflow-x-auto rounded-lg border border-navy/15 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-navy text-white">
              <th className="text-left px-3 py-2 font-semibold w-[60px]">Order</th>
              <th className="text-left px-3 py-2 font-semibold">Academy</th>
              <th className="text-left px-3 py-2 font-semibold">Player 1</th>
              <th className="text-left px-3 py-2 font-semibold">Player 2</th>
            </tr>
          </thead>
          <tbody>
            {PARTICIPANTS.map((p) => (
              <tr key={p.order} className="border-t border-navy/10 hover:bg-navy/[0.03]">
                <td className="px-3 py-2 font-bold tabular-nums text-aba-red">{p.order}</td>
                <td className="px-3 py-2 font-semibold text-navy">{p.academy}</td>
                <td className="px-3 py-2 text-navy/80">{p.player1}</td>
                <td className="px-3 py-2 text-navy/80">{p.player2}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

// ── section 2: rules ─────────────────────────────────────────────────────────

function RulesCard() {
  return (
    <section className="h-full">
      <SectionHeader eyebrow="Section 2" title="Rules & Format" />
      <div className="rounded-lg border border-navy/15 bg-white shadow-sm p-4 sm:p-5">
        <ol className="space-y-2.5">
          {RULES.map((rule, i) => (
            <li key={i} className="flex gap-3 items-baseline text-[14px] leading-relaxed text-navy">
              <span className="shrink-0 inline-flex items-center justify-center w-6 h-6 rounded-full bg-aba-red text-white text-[11px] font-bold tabular-nums">
                {i + 1}
              </span>
              <span>{rule}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

// ── section 3: hype team ─────────────────────────────────────────────────────

function HypeRulesCard() {
  return (
    <section className="h-full">
      <SectionHeader eyebrow="Section 3" title="Hype Team & On-Field" />
      <div className="rounded-lg border border-aba-red/30 bg-aba-red/[0.03] shadow-sm p-4 sm:p-5">
        <ul className="space-y-2.5">
          {HYPE_RULES.map((rule, i) => (
            <li key={i} className="flex gap-3 items-baseline text-[14px] leading-relaxed text-navy">
              <span className="shrink-0 mt-1 w-1.5 h-1.5 rounded-full bg-aba-red" aria-hidden />
              <span>{rule}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

// ── section 4: rotation grid ─────────────────────────────────────────────────

function RotationGrid() {
  return (
    <section>
      <SectionHeader eyebrow="Section 4" title="Event Rotation Grid" />
      <div className="overflow-x-auto rounded-lg border border-navy/15 bg-white shadow-sm">
        <table className="w-full text-sm min-w-[760px]">
          <thead>
            <tr className="bg-navy text-white">
              <th className="text-left px-3 py-2 font-semibold">Batting Team</th>
              <th className="text-left px-3 py-2 font-semibold">Hitters</th>
              <th className="text-left px-3 py-2 font-semibold">Shag Team</th>
              <th className="text-left px-3 py-2 font-semibold">Home Run Ball Retrieval</th>
              <th className="text-left px-3 py-2 font-semibold">Hype / On-Field Team</th>
            </tr>
          </thead>
          <tbody>
            {ROTATION.map((r, i) => (
              <tr key={i} className="border-t border-navy/10 hover:bg-navy/[0.03]">
                <td className="px-3 py-2.5 font-bold text-aba-red">{r.battingTeam}</td>
                <td className="px-3 py-2.5 text-navy/80">{r.hitters}</td>
                <td className="px-3 py-2.5 text-navy">{r.shagTeam}</td>
                <td className="px-3 py-2.5 text-navy">{r.retrievalTeam}</td>
                <td className="px-3 py-2.5 text-navy">{r.hypeTeam}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
