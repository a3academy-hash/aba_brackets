import { Redis } from '@upstash/redis';
import type { Division, DivisionState, GameId, GameResult } from './types';
import { emptyDivisionState, EMPTY_RESULT } from './types';
import { seedLatestFinalizedAt, seedResultsForDivision } from './seedResults';

/**
 * KV layout — one key per division:
 *   aba:state:premier   → DivisionState
 *   aba:state:prospect  → DivisionState
 *   aba:state:varsity   → DivisionState
 *   aba:state:jv        → DivisionState
 *
 * One read per division per page render; one write per admin action.
 */

const KEY_PREFIX = 'aba:state:';
const stateKey = (div: Division): string => `${KEY_PREFIX}${div}`;

// ── client init ───────────────────────────────────────────────────────────────

type Store = {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T): Promise<unknown>;
};

let client: Store | null = null;

function getClient(): Store {
  if (client) return client;

  const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;

  if (url && token) {
    const redis = new Redis({ url, token });
    client = {
      get: <T>(k: string) => redis.get<T>(k),
      set: <T>(k: string, v: T) => redis.set(k, v),
    };
    return client;
  }

  // Fallback: in-process Map. State resets on server restart. Loud warning so
  // nobody assumes this is persistent. In prod this is an emphatic warning, not
  // an error — any deployment (Vercel) should have KV configured, but failing
  // hard here would also break local prod-mode testing (`npm run start`).
  const banner =
    process.env.NODE_ENV === 'production'
      ? '[kv] PRODUCTION WITHOUT KV — state is in-memory and will not survive restarts. Set KV_REST_API_URL/_TOKEN before going live.'
      : '[kv] No KV credentials in env — using in-memory fallback. State will be lost on server restart.';
  console.warn(banner);
  const mem = new Map<string, unknown>();
  client = {
    get: async <T>(k: string) => (mem.get(k) ?? null) as T | null,
    set: async <T>(k: string, v: T) => {
      mem.set(k, v);
    },
  };
  return client;
}

// ── reads ─────────────────────────────────────────────────────────────────────

export async function getDivisionState(div: Division): Promise<DivisionState> {
  const stored = await getClient().get<DivisionState>(stateKey(div));
  const seed = seedResultsForDivision(div);

  // No seed entries for this division → original behavior.
  if (Object.keys(seed).length === 0) {
    return stored ?? emptyDivisionState();
  }

  // Stored results win per game; seed fills in any games KV hasn't touched.
  const results = { ...seed, ...(stored?.results ?? {}) };

  // Prefer stored.updatedAt if KV has ever been written to; otherwise show
  // the most recent seed finalizedAt so the hero doesn't say "Awaiting first
  // results" when seeded winners are visible on the cards.
  const epoch = new Date(0).toISOString();
  let updatedAt = stored?.updatedAt ?? epoch;
  if (updatedAt === epoch) {
    updatedAt = seedLatestFinalizedAt(div) ?? epoch;
  }

  return { results, updatedAt };
}

export async function getAllStates(): Promise<Record<Division, DivisionState>> {
  const [premier, prospect, varsity, jv] = await Promise.all([
    getDivisionState('premier'),
    getDivisionState('prospect'),
    getDivisionState('varsity'),
    getDivisionState('jv'),
  ]);
  return { premier, prospect, varsity, jv };
}

// ── writes ────────────────────────────────────────────────────────────────────

export async function setGameResult(
  div: Division,
  gameId: GameId,
  patch: Partial<GameResult>,
): Promise<DivisionState> {
  const current = await getDivisionState(div);
  const existing = current.results[gameId] ?? EMPTY_RESULT;
  const merged: GameResult = {
    ...existing,
    ...patch,
    finalizedAt: patch.winner ? new Date().toISOString() : existing.finalizedAt,
  };
  const next: DivisionState = {
    results: { ...current.results, [gameId]: merged },
    updatedAt: new Date().toISOString(),
  };
  await getClient().set(stateKey(div), next);
  return next;
}

export async function clearGameResult(
  div: Division,
  gameId: GameId,
): Promise<DivisionState> {
  const current = await getDivisionState(div);
  const nextResults = { ...current.results };
  delete nextResults[gameId];
  const next: DivisionState = {
    results: nextResults,
    updatedAt: new Date().toISOString(),
  };
  await getClient().set(stateKey(div), next);
  return next;
}
