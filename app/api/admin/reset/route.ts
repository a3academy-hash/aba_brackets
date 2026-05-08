import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { clearGameResult } from '@/lib/kv';
import { GAMES_BY_ID } from '@/lib/schedule';
import type { GameId } from '@/lib/types';

type Body = { gameId: GameId };

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

  const next = await clearGameResult(game.division, game.id);
  revalidatePath('/');
  revalidatePath('/admin');
  return NextResponse.json({ ok: true, state: next });
}
