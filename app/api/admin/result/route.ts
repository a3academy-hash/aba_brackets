import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { setGameResult } from '@/lib/kv';
import { GAMES_BY_ID } from '@/lib/schedule';
import type { GameId, TeamId } from '@/lib/types';

type Body = {
  gameId: GameId;
  winner: TeamId | null;       // null = no winner yet (e.g., score-only edit)
  awayScore?: number | null;
  homeScore?: number | null;
};

export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: 'invalid json' }, { status: 400 });
  }

  const game = GAMES_BY_ID[body.gameId];
  if (!game) {
    return NextResponse.json({ error: `unknown gameId: ${body.gameId}` }, { status: 400 });
  }

  // If a winner is specified, it must belong to this game's division
  if (body.winner && !body.winner.startsWith(`${game.division}.`)) {
    return NextResponse.json(
      { error: `winner ${body.winner} not in division ${game.division}` },
      { status: 400 },
    );
  }

  const next = await setGameResult(game.division, game.id, {
    winner: body.winner,
    awayScore: body.awayScore ?? null,
    homeScore: body.homeScore ?? null,
  });

  revalidatePath('/');
  revalidatePath('/admin');
  return NextResponse.json({ ok: true, state: next });
}
