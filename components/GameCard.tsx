import type { Game, GameId, GameResult } from '@/lib/types';
import {
  gameDisplayTime,
  gameTitleLabel,
  resolveSlot,
  type ResolvedSlot,
} from '@/lib/resolve';
import {
  markWinnerAction,
  resetGameAction,
  updateScoreAction,
} from '@/app/admin/actions';

type Props = {
  game: Game;
  results: Partial<Record<GameId, GameResult>>;
  /** When admin = true, team rows become tap-to-advance buttons. */
  admin?: boolean;
  /** Whether to gray the card (used for the IF game when WB-side won FIN). */
  dimmed?: boolean;
};

export function GameCard({ game, results, admin = false, dimmed = false }: Props) {
  const result = results[game.id];
  const away = resolveSlot(game.away, results);
  const home = resolveSlot(game.home, results);
  const time = gameDisplayTime(game);
  const title = gameTitleLabel(game);
  const titleShort = shortTitle(game, title);

  return (
    <div
      data-game-id={game.id}
      className={[
        'group relative w-full h-full rounded-md border bg-card overflow-hidden flex flex-col',
        dimmed ? 'opacity-50 border-navy/20 grayscale' : 'border-navy/40 shadow-sm',
      ].join(' ')}
    >
      <header className="bg-navy text-white px-2 h-[22px] shrink-0 flex items-center justify-between text-[10px] font-semibold leading-none">
        <span className="truncate">{titleShort}</span>
        <span className="opacity-80 font-normal shrink-0 ml-1 tabular-nums">
          {game.division === 'jv' ? `${dayShort(game.date)} ` : ''}
          {game.field.replace('Field ', 'F')} · {compactTime(time)}
        </span>
      </header>

      <Side
        slot={away}
        score={result?.awayScore ?? null}
        isWinner={!!(result?.winner && away.kind === 'team' && result.winner === away.teamId)}
        admin={admin}
        gameId={game.id}
      />
      <div className="border-t border-navy/15 shrink-0" />
      <Side
        slot={home}
        score={result?.homeScore ?? null}
        isWinner={!!(result?.winner && home.kind === 'team' && result.winner === home.teamId)}
        admin={admin}
        gameId={game.id}
      />

      {admin ? <EditPopover game={game} result={result ?? null} /> : null}
    </div>
  );
}

function shortTitle(game: Game, fallback: string): string {
  if (game.bracket === 'FINAL') return 'FINAL';
  if (game.bracket === 'IF') return 'IF';
  return fallback.replace('Game ', 'G');
}

function Side({
  slot,
  score,
  isWinner,
  admin,
  gameId,
}: {
  slot: ResolvedSlot;
  score: number | null;
  isWinner: boolean;
  admin: boolean;
  gameId: GameId;
}) {
  const labelText = slot.kind === 'team' ? slot.displayName : slot.label;
  const teamId = slot.kind === 'team' ? slot.teamId : null;

  // The card uses flex-col so each Side fills half the remaining height after
  // the header. flex-1 + min-h-0 allows the row to shrink to fit the parent.
  const rowClass = [
    'flex items-center justify-between px-2 flex-1 min-h-0',
    isWinner ? 'bg-emerald-500/15 border-l-[3px] border-emerald-500' : '',
    slot.kind === 'placeholder' ? 'text-muted italic text-[11px]' : 'text-navy font-medium text-[12px]',
  ].join(' ');

  const inner = (
    <div className={rowClass}>
      <span className="truncate flex-1">{labelText}</span>
      <span
        className={[
          'tabular-nums shrink-0 ml-1 text-[12px]',
          isWinner ? 'font-bold text-emerald-600' : 'text-muted',
        ].join(' ')}
      >
        {score ?? ''}
      </span>
    </div>
  );

  if (admin && teamId) {
    return (
      <form action={markWinnerAction} className="contents">
        <input type="hidden" name="gameId" value={gameId} />
        <input type="hidden" name="winner" value={teamId} />
        <button
          type="submit"
          className="block w-full flex-1 min-h-0 text-left hover:bg-navy/5 active:bg-navy/10 transition cursor-pointer"
        >
          {inner}
        </button>
      </form>
    );
  }
  return inner;
}

function EditPopover({ game, result }: { game: Game; result: GameResult | null }) {
  const hasResult = result?.winner != null || result?.awayScore != null || result?.homeScore != null;
  return (
    <details className="absolute top-0 right-0 z-20">
      <summary
        className="list-none cursor-pointer w-[18px] h-[18px] flex items-center justify-center text-white/70 hover:text-white text-[14px] leading-none select-none"
        aria-label="Edit game"
      >
        ⋯
      </summary>
      <div className="absolute right-0 top-[20px] w-[180px] rounded-md border border-navy/30 bg-white shadow-lg p-2 space-y-2">
        <form action={updateScoreAction} className="flex items-center gap-1">
          <input type="hidden" name="gameId" value={game.id} />
          <ScoreInput name="awayScore" value={result?.awayScore ?? null} placeholder="A" />
          <span className="text-muted text-xs">–</span>
          <ScoreInput name="homeScore" value={result?.homeScore ?? null} placeholder="H" />
          <button
            type="submit"
            className="ml-auto rounded bg-navy text-white text-[11px] font-semibold px-2 py-1 hover:bg-navy-dark"
          >
            Save
          </button>
        </form>
        {hasResult ? (
          <form action={resetGameAction}>
            <input type="hidden" name="gameId" value={game.id} />
            <button
              type="submit"
              className="w-full text-[11px] text-aba-red hover:underline py-0.5 text-center"
            >
              Reset game
            </button>
          </form>
        ) : null}
      </div>
    </details>
  );
}

function ScoreInput({
  name,
  value,
  placeholder,
}: {
  name: string;
  value: number | null;
  placeholder: string;
}) {
  return (
    <input
      name={name}
      type="number"
      inputMode="numeric"
      min={0}
      max={99}
      defaultValue={value ?? ''}
      placeholder={placeholder}
      className="w-10 rounded border border-navy/30 px-1 py-0.5 text-[12px] tabular-nums text-center focus:outline-none focus:border-aba-red"
    />
  );
}

function dayShort(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getUTCDay()];
}

/** "10:00 AM" → "10a", "12:15 PM" → "12:15p", "1:00 PM" → "1p" */
function compactTime(t: string): string {
  const m = t.match(/^(\d{1,2})(?::(\d{2}))?\s?(AM|PM)$/i);
  if (!m) return t;
  const hh = m[1];
  const mm = m[2];
  const ampm = m[3].toLowerCase().startsWith('a') ? 'a' : 'p';
  return mm && mm !== '00' ? `${hh}:${mm}${ampm}` : `${hh}${ampm}`;
}
