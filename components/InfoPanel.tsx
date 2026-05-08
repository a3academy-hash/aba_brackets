/**
 * Tournament info panel — used as a sidebar on desktop, an accordion on mobile.
 * Static content; if dates/fees/etc. change, edit this file.
 */

type Block = { title: string; lines: string[] };

const BLOCKS: Block[] = [
  {
    title: 'Tournament',
    lines: ['May 12–15, 2026', 'Lakepoint Complex', 'Emerson, GA'],
  },
  {
    title: 'Entry Fees',
    lines: ['Tournament Pass — $25', 'Day Pass — $15'],
  },
  {
    title: 'Live Streaming + Stats',
    lines: ['PlaySight', 'Tournament Pass — $25', 'Day Pass — $15'],
  },
  {
    title: 'Awards & Home Run Derby',
    lines: ['Monday, May 11, 2026', 'Awards · 7:30 PM', 'Home Run Derby · 8:00 PM'],
  },
];

export function InfoPanel() {
  return (
    <>
      {/* Desktop: persistent sidebar */}
      <aside className="hidden lg:block w-[240px] shrink-0 border-l border-navy/10 bg-white">
        <div className="sticky top-[7.5rem] p-4 space-y-4">
          {BLOCKS.map((b) => (
            <InfoBlock key={b.title} block={b} />
          ))}
        </div>
      </aside>

      {/* Mobile: collapsible accordion below the bracket */}
      <div className="lg:hidden border-t border-navy/10 bg-white">
        <details className="group">
          <summary className="cursor-pointer select-none px-4 py-3 text-sm font-semibold text-navy flex items-center justify-between tap-target">
            <span>Tournament info</span>
            <span className="text-aba-red transition group-open:rotate-180">▾</span>
          </summary>
          <div className="px-4 pb-4 space-y-4">
            {BLOCKS.map((b) => (
              <InfoBlock key={b.title} block={b} />
            ))}
          </div>
        </details>
      </div>
    </>
  );
}

function InfoBlock({ block }: { block: Block }) {
  return (
    <div>
      <h3 className="text-[11px] font-bold uppercase tracking-wider text-aba-red">
        {block.title}
      </h3>
      <ul className="mt-1.5 space-y-0.5 text-sm text-navy">
        {block.lines.map((l, i) => (
          <li key={i}>{l}</li>
        ))}
      </ul>
    </div>
  );
}
