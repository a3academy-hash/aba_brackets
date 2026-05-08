import { NextResponse, type NextRequest } from 'next/server';
import { SESSION_COOKIE_NAME, verifySessionCookie } from '@/lib/auth';

/**
 * Gates /admin and /api/admin routes behind the session cookie.
 * /admin/login is excluded so the login form itself is reachable.
 *
 * In Next.js 16 the file convention is `proxy.ts` (renamed from `middleware.ts`).
 */
export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // The login page must remain public
  if (path === '/admin/login' || path === '/api/admin/login') {
    return NextResponse.next();
  }

  const cookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const ok = await verifySessionCookie(cookie);

  if (!ok) {
    // For API routes return 401; for pages redirect to login
    if (path.startsWith('/api/')) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    }
    const url = new URL('/admin/login', request.url);
    url.searchParams.set('next', path);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
