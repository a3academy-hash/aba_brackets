'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { SESSION_COOKIE_NAME, verifySessionCookie } from '@/lib/auth';
import { clearGameResult, setGameResult } from '@/lib/kv';
import { GAMES_BY_ID } from '@/lib/schedule';
import type { GameId, TeamId } from '@/lib/types';

async function requireAdmin() {
  // proxy.ts already gates /admin and /api/admin, but server actions can be
  // imported anywhere — re-check the session here as defense in depth.
  const store = await cookies();
  const cookie = store.get(SESSION_COOKIE_NAME)?.value;
  if (!(await verifySessionCookie(cookie))) {
    throw new Error('Unauthorized');
  }
}

function asNumberOrNull(v: FormDataEntryValue | null): number | null {
  if (v === null) return null;
  const s = String(v).trim();
  if (s === '') return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

export async function markWinnerAction(formData: FormData) {
  await requireAdmin();
  const gameId = String(formData.get('gameId') ?? '') as GameId;
  const winner = (formData.get('winner') ? String(formData.get('winner')) : null) as TeamId | null;
  const game = GAMES_BY_ID[gameId];
  if (!game) throw new Error(`unknown gameId: ${gameId}`);
  if (winner && !winner.startsWith(`${game.division}.`)) {
    throw new Error(`winner ${winner} not in division ${game.division}`);
  }
  await setGameResult(game.division, gameId, {
    winner,
    awayScore: asNumberOrNull(formData.get('awayScore')),
    homeScore: asNumberOrNull(formData.get('homeScore')),
  });
  revalidatePath('/');
  revalidatePath('/admin');
}

export async function updateScoreAction(formData: FormData) {
  // Like markWinnerAction but doesn't require a winner — just updates scores.
  await requireAdmin();
  const gameId = String(formData.get('gameId') ?? '') as GameId;
  const game = GAMES_BY_ID[gameId];
  if (!game) throw new Error(`unknown gameId: ${gameId}`);
  await setGameResult(game.division, gameId, {
    awayScore: asNumberOrNull(formData.get('awayScore')),
    homeScore: asNumberOrNull(formData.get('homeScore')),
  });
  revalidatePath('/');
  revalidatePath('/admin');
}

export async function resetGameAction(formData: FormData) {
  await requireAdmin();
  const gameId = String(formData.get('gameId') ?? '') as GameId;
  const game = GAMES_BY_ID[gameId];
  if (!game) throw new Error(`unknown gameId: ${gameId}`);
  await clearGameResult(game.division, gameId);
  revalidatePath('/');
  revalidatePath('/admin');
}
