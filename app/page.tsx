import { BracketView } from '@/components/BracketView';
import { ChampionshipBell } from '@/components/ChampionshipBell';
import { DivisionTabs, TAB_KEYS, type TabKey } from '@/components/DivisionTabs';
import { HomeRunDerby } from '@/components/HomeRunDerby';
import { InfoPanel } from '@/components/InfoPanel';
import { ScheduleGrid } from '@/components/ScheduleGrid';
import { SiteHeader } from '@/components/SiteHeader';
import { getAllStates } from '@/lib/kv';

// Public bracket page — auto-revalidate every 60s as a fallback for visitors
// who don't refresh. Admin writes also call revalidatePath('/').
export const revalidate = 60;

type SearchParams = Promise<{ d?: string }>;

export default async function HomePage({ searchParams }: { searchParams: SearchParams }) {
  const { d } = await searchParams;
  const active = parseTab(d);
  const states = await getAllStates();

  return (
    <>
      <SiteHeader />
      <DivisionTabs active={active} />
      {active === 'derby' ? (
        <main className="flex-1 min-w-0">
          <HomeRunDerby />
        </main>
      ) : active === 'bell' ? (
        <main className="flex-1 min-w-0">
          <ChampionshipBell />
        </main>
      ) : (
        <div className="flex-1 flex flex-col lg:flex-row">
          <main className="flex-1 min-w-0 py-4">
            {active === 'grid' ? (
              <ScheduleGrid states={states} admin={false} />
            ) : (
              <BracketView division={active} state={states[active]} admin={false} />
            )}
          </main>
          <InfoPanel />
        </div>
      )}
      <footer className="py-6 text-center text-xs text-muted border-t border-navy/10">
        ABA National Championship · {new Date().getFullYear()}
      </footer>
    </>
  );
}

function parseTab(raw: string | undefined): TabKey {
  if (raw && (TAB_KEYS as readonly string[]).includes(raw)) return raw as TabKey;
  return 'derby';
}
