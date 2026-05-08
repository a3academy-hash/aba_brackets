import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import {
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE_SECONDS,
  checkPassword,
  createSessionCookie,
} from '@/lib/auth';

async function login(formData: FormData) {
  'use server';
  const password = formData.get('password');
  const next = formData.get('next');
  const target = typeof next === 'string' && next.startsWith('/admin') ? next : '/admin';

  if (typeof password !== 'string' || !checkPassword(password)) {
    redirect(`/admin/login?error=1${typeof next === 'string' ? `&next=${encodeURIComponent(next)}` : ''}`);
  }

  const value = await createSessionCookie();
  const store = await cookies();
  store.set(SESSION_COOKIE_NAME, value, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: SESSION_MAX_AGE_SECONDS,
    path: '/',
  });
  redirect(target);
}

type SearchParams = Promise<{ error?: string; next?: string }>;

export default async function LoginPage({ searchParams }: { searchParams: SearchParams }) {
  const { error, next } = await searchParams;
  const showError = error === '1';

  return (
    <main className="min-h-screen flex items-center justify-center px-6 bg-white">
      <form
        action={login}
        className="w-full max-w-sm rounded-2xl border border-navy/20 shadow-sm bg-white p-6 space-y-4"
      >
        <h1 className="text-xl font-semibold text-navy">Admin sign-in</h1>
        <p className="text-sm text-slate-600">
          Enter the admin password to update game results.
        </p>
        <input
          name="password"
          type="password"
          autoFocus
          required
          autoComplete="current-password"
          className="w-full rounded-lg border border-navy/30 px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-aba-red/50"
          placeholder="Password"
        />
        {next ? <input type="hidden" name="next" value={next} /> : null}
        {showError ? (
          <p className="text-sm text-aba-red">Incorrect password.</p>
        ) : null}
        <button
          type="submit"
          className="w-full rounded-lg bg-navy text-white font-semibold py-3 text-base hover:bg-navy-dark active:translate-y-px transition"
        >
          Sign in
        </button>
      </form>
    </main>
  );
}
