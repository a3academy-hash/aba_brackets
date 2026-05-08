import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { SESSION_COOKIE_NAME } from '@/lib/auth';

export async function POST(req: Request) {
  const store = await cookies();
  store.delete(SESSION_COOKIE_NAME);
  return NextResponse.redirect(new URL('/', req.url), { status: 303 });
}
