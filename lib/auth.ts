/**
 * Single-admin auth using an env-var password and HMAC-signed session cookie.
 *
 * Uses Web Crypto (crypto.subtle) so this module works in both the Node and
 * Edge runtimes — the Edge runtime is required by proxy.ts.
 */

export const SESSION_COOKIE_NAME = 'aba_admin';
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

function getSecret(): string {
  return process.env.ADMIN_PASSWORD ?? 'dev-only-insecure-do-not-use-in-prod';
}

let cachedKey: Promise<CryptoKey> | null = null;
function importKey(): Promise<CryptoKey> {
  if (!cachedKey) {
    cachedKey = crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(getSecret()),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign'],
    );
  }
  return cachedKey;
}

async function hmacHex(payload: string): Promise<string> {
  const key = await importKey();
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payload));
  return [...new Uint8Array(sig)]
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

export async function createSessionCookie(): Promise<string> {
  const issued = Date.now().toString();
  const sig = await hmacHex(issued);
  return `${issued}.${sig}`;
}

export async function verifySessionCookie(value: string | undefined): Promise<boolean> {
  if (!value) return false;
  const dot = value.indexOf('.');
  if (dot < 1) return false;
  const issued = value.slice(0, dot);
  const sig = value.slice(dot + 1);
  const expectedSig = await hmacHex(issued);
  if (!constantTimeEqual(sig, expectedSig)) return false;
  const issuedMs = Number(issued);
  if (!Number.isFinite(issuedMs)) return false;
  return Date.now() - issuedMs < SESSION_MAX_AGE_SECONDS * 1000;
}

export function checkPassword(submitted: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) {
    // Refuse login when no password is configured (rather than silently allowing it).
    return false;
  }
  return constantTimeEqual(submitted, expected);
}
