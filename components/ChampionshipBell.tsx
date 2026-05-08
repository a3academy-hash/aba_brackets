// ─────────────────────────────────────────────────────────────────────────────
// EDIT BELOW — copy and image references for the Championship Bell page.
// To add real photos: drop files in /public/images/ (e.g. /public/images/bell-1.jpg)
// then change `src: null` to `src: '/images/bell-1.jpg'` in BELL_IMAGES.
// While src stays null, the page renders a stylized placeholder card.
// ─────────────────────────────────────────────────────────────────────────────

const HERO = {
  title: 'The ABA Champion Does Not Lift a Trophy. They Ring the Bell.',
  subtitle: 'Built for independence. Earned through discipline. Passed down by champions.',
  // Optional: set a hero photo path (e.g. '/images/bell-hero.jpg') to replace
  // the gradient. Leave null for the gradient placeholder.
  imageSrc: null as string | null,
};

const WHY_PARAGRAPHS: string[] = [
  'The ABA champion is not awarded a trophy.',
  'The ABA champion is not awarded a cup.',
  'The ABA champion is awarded a bell.',
  'The bell was chosen because it means something. It represents independence, discipline, and the courage to choose a different path.',
  'Every athlete in the Academy Baseball Association has stepped outside the traditional system. They have chosen an alternative path of education and development, one that demands maturity, structure, sacrifice, and self-discipline.',
  'This is not the path millions of students pass through by default.',
  'This is a chosen path.',
  'Just as the bell symbolized independence at the founding of this country, the ABA Championship Bell represents the independence our athletes have chosen: the independence to train differently, learn differently, compete differently, and build themselves outside the beaten path.',
];

const RING_PARAGRAPHS: string[] = [
  'In boxing, the bell marks the end of the fight.',
  'For the ABA, the Championship Bell marks the end of the season.',
  'After months of training, travel, competition, adversity, and pressure, only one team in each division earns the right to ring the bell.',
];

const RING_DECLARATIONS: string[] = [
  'The bell is not decoration.',
  'It is not a participation trophy.',
  'It is not handed out.',
];

const TRADITION_PARAGRAPHS: string[] = [
  'Each ABA champion will receive a smaller version of the Championship Bell to keep at its facility.',
  'But the Premier Division champion earns something bigger.',
  'The Premier champion takes home the main ABA Championship Bell and keeps it for the year. The next season, that champion brings the bell back and places it on the line for the next team trying to earn it.',
  'The bell becomes a traveling symbol of the league’s highest standard.',
];

type BellImage = { src: string | null; alt: string; caption: string };

const BELL_IMAGES: BellImage[] = [
  { src: null, alt: 'ABA Championship Bell front view', caption: 'The ABA Championship Bell' },
  { src: null, alt: 'ABA Championship Bell detail',     caption: 'Built for champions'        },
  { src: null, alt: 'ABA Championship Bell on display', caption: 'Only champions ring the bell' },
];

// ─────────────────────────────────────────────────────────────────────────────
// END EDIT — layout below.
// ─────────────────────────────────────────────────────────────────────────────

export function ChampionshipBell() {
  return (
    <section className="w-full">
      <Hero />
      <div className="px-4 lg:px-6 py-10 space-y-10 max-w-screen-md mx-auto">
        <WhySection />
        <RingSection />
        <TraditionSection />
      </div>
      <Gallery />
    </section>
  );
}

// ── hero ─────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <div className="relative overflow-hidden">
      {HERO.imageSrc ? (
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
              'radial-gradient(ellipse at 50% 30%, #1a2a3e 0%, #06162a 50%, #000 100%)',
          }}
        />
      )}

      {/* Vignette + texture */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-40 mix-blend-overlay"
        style={{
          background:
            'radial-gradient(circle at 50% 25%, rgba(255,200,80,0.15), transparent 55%)',
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"
      />

      {/* Subtle "metal" sheen line */}
      <div
        aria-hidden
        className="absolute left-0 right-0 top-1/2 h-px"
        style={{
          background:
            'linear-gradient(to right, transparent 0%, rgba(255,200,80,0.4) 50%, transparent 100%)',
        }}
      />

      <div className="relative px-4 lg:px-6 py-20 sm:py-28 max-w-screen-xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur border border-white/25 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-white/90">
          <span aria-hidden>★</span>
          ABA Championship Bell
        </div>
        <h1 className="mt-5 text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.05] drop-shadow-lg max-w-4xl mx-auto">
          {HERO.title}
        </h1>
        <p className="mt-4 text-base sm:text-lg text-white/85 font-medium tracking-wide max-w-2xl mx-auto">
          {HERO.subtitle}
        </p>

        {!HERO.imageSrc ? (
          <p className="mt-8 inline-block text-[10px] uppercase tracking-wider text-white/55 border border-white/20 rounded px-2 py-1">
            Hero image placeholder — set HERO.imageSrc in ChampionshipBell.tsx
          </p>
        ) : null}
      </div>
    </div>
  );
}

// ── shared section header ────────────────────────────────────────────────────

function SectionHeader({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <header className="mb-5 text-center">
      <div className="text-[11px] font-bold uppercase tracking-[0.25em] text-aba-red">
        {eyebrow}
      </div>
      <h2 className="mt-1 text-3xl sm:text-4xl font-black text-navy leading-tight">
        {title}
      </h2>
      <div className="mt-3 mx-auto w-12 h-px bg-aba-red" aria-hidden />
    </header>
  );
}

// ── section 1: why a bell ────────────────────────────────────────────────────

function WhySection() {
  return (
    <section>
      <SectionHeader eyebrow="Section 1" title="Why a Bell?" />
      <div className="space-y-4 text-[16px] sm:text-[17px] leading-relaxed text-navy/90">
        {WHY_PARAGRAPHS.map((p, i) => {
          const isStandalone = p.startsWith('The ABA champion') || p === 'This is a chosen path.' || p === 'This is not the path millions of students pass through by default.';
          return (
            <p
              key={i}
              className={isStandalone ? 'font-semibold text-navy text-center text-[18px] sm:text-[19px]' : ''}
            >
              {p}
            </p>
          );
        })}
      </div>
    </section>
  );
}

// ── section 2: ring the bell ─────────────────────────────────────────────────

function RingSection() {
  return (
    <section className="rounded-xl border border-navy/15 bg-navy text-white shadow-md p-6 sm:p-8">
      <header className="mb-5 text-center">
        <div className="text-[11px] font-bold uppercase tracking-[0.25em] text-aba-red">
          Section 2
        </div>
        <h2 className="mt-1 text-3xl sm:text-4xl font-black leading-tight text-white">
          Ring the Bell
        </h2>
        <div className="mt-3 mx-auto w-12 h-px bg-aba-red" aria-hidden />
      </header>

      <div className="space-y-3 text-[16px] sm:text-[17px] leading-relaxed text-white/90 max-w-2xl mx-auto text-center">
        {RING_PARAGRAPHS.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>

      <div className="mt-8 max-w-md mx-auto space-y-1.5 text-center">
        {RING_DECLARATIONS.map((line, i) => (
          <p key={i} className="text-[14px] sm:text-[15px] uppercase tracking-wider text-white/60 font-semibold">
            {line}
          </p>
        ))}
      </div>

      <p className="mt-8 text-2xl sm:text-3xl font-black tracking-tight text-aba-red text-center">
        It is earned.
      </p>
      <p className="mt-2 text-base sm:text-lg italic text-white/80 text-center">
        Only champions ring the bell.
      </p>
    </section>
  );
}

// ── section 3: tradition ─────────────────────────────────────────────────────

function TraditionSection() {
  return (
    <section>
      <SectionHeader eyebrow="Section 3" title="The Tradition" />
      <div className="space-y-4 text-[16px] sm:text-[17px] leading-relaxed text-navy/90">
        {TRADITION_PARAGRAPHS.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
      <div className="mt-8 rounded-lg border border-aba-red/30 bg-aba-red/[0.04] p-5 text-center">
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-aba-red">
          Every Year
        </p>
        <p className="mt-2 text-2xl sm:text-3xl font-black tracking-tight text-navy">
          Who earns the right to ring it next?
        </p>
      </div>
    </section>
  );
}

// ── section 4: gallery ───────────────────────────────────────────────────────

function Gallery() {
  return (
    <section className="bg-navy/[0.04] border-y border-navy/10 py-12 px-4 lg:px-6">
      <div className="max-w-screen-xl mx-auto">
        <SectionHeader eyebrow="Section 4" title="The Bell" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {BELL_IMAGES.map((img, i) => (
            <GalleryCard key={i} image={img} index={i} />
          ))}
        </div>
        <p className="mt-6 text-center text-[11px] uppercase tracking-wider text-muted">
          Replace placeholders by uploading to <code className="font-mono">/public/images/</code> and editing <code className="font-mono">BELL_IMAGES</code> in <code className="font-mono">ChampionshipBell.tsx</code>.
        </p>
      </div>
    </section>
  );
}

function GalleryCard({ image, index }: { image: BellImage; index: number }) {
  return (
    <figure className="rounded-lg overflow-hidden border border-navy/15 bg-white shadow-sm">
      <div
        className="relative aspect-[4/3]"
        style={
          image.src
            ? undefined
            : {
                background:
                  'linear-gradient(135deg, #06162a 0%, #1a2a3e 60%, #c8102e 130%)',
              }
        }
      >
        {image.src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image.src}
            alt={image.alt}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
            <div className="text-5xl mb-2" aria-hidden>★</div>
            <div className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-70">
              Bell Image {index + 1}
            </div>
            <div className="mt-1 text-[10px] uppercase tracking-wider opacity-50">
              Placeholder
            </div>
          </div>
        )}
      </div>
      <figcaption className="px-3 py-2.5 text-[13px] font-semibold text-navy text-center border-t border-navy/10">
        {image.caption}
      </figcaption>
    </figure>
  );
}
