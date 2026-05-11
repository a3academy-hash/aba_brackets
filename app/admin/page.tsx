import { BracketView } from '@/components/BracketView';
import { ChampionshipBell } from '@/components/ChampionshipBell';
import { DivisionTabs } from '@/components/DivisionTabs';
import { HomeRunDerby } from '@/components/HomeRunDerby';
import { Rosters } from '@/components/Rosters';
import { Rules } from '@/components/Rules';
import { ScheduleGrid } from '@/components/ScheduleGrid';
import { SiteHeader } from '@/components/SiteHeader';
import { getAllStates } from '@/lib/kv';
import { TAB_KEYS, type TabKey } from '@/lib/tabs';

// Always render fresh — admin needs to see their own writes immediately.
export const dynamic = 'force-dynamic';

type SearchParams = Promise<{ d?: string }>;

export default async function AdminPage({ searchParams }: { searchParams: SearchParams }) {
  const { d } = await searchParams;
  const active = parseTab(d);
  const states = await getAllStates();

  return (
    <>
      <SiteHeader />
      <DivisionTabs active={active} basePath="/admin" />
      <div className="bg-aba-red/5 border-b border-aba-red/30 text-aba-red text-xs font-medium px-4 lg:px-6 py-2 flex items-center justify-between">
        <span>Admin mode — tap a team to mark them the winner.</span>
        <form action="/api/admin/logout" method="post">
          <button type="submit" className="underline hover:no-underline">
            Sign out
          </button>
        </form>
      </div>
      <main className="max-w-screen-2xl w-full mx-auto py-4">
        {active === 'derby' ? (
          <HomeRunDerby />
        ) : active === 'bell' ? (
          <ChampionshipBell />
        ) : active === 'rules' ? (
          <Rules />
        ) : active === 'rosters' ? (
          <Rosters />
        ) : active === 'grid' ? (
          <ScheduleGrid states={states} admin />
        ) : (
          <BracketView division={active} state={states[active]} admin />
        )}
      </main>
    </>
  );
}

function parseTab(raw: string | undefined): TabKey {
  if (raw && (TAB_KEYS as readonly string[]).includes(raw)) return raw as TabKey;
  return 'derby';
}
