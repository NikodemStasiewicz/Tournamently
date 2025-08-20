import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value;

  if (!token) {
    const loginUrl = new URL('/login', req.url);
    const callbackUrl = req.nextUrl.pathname + req.nextUrl.search;
    loginUrl.searchParams.set('callbackUrl', callbackUrl);
    return NextResponse.redirect(loginUrl);
  }

  if (req.nextUrl.pathname.startsWith('/admin')) {
    try {
      const meUrl = new URL('/api/auth/me', req.url);
      const res = await fetch(meUrl, { headers: { cookie: req.headers.get('cookie') ?? '' } });
      const data = await res.json();
      const role = data?.user?.role;
      if (role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/', req.url));
      }
    } catch (e) {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  return NextResponse.next();
}


export const config = {
  matcher: [
    '/teams/:path*',
    '/profile/:path*',
    '/prediction/:path*',
    '/admin/:path*',
    '/tournaments/new',
    '/tournaments/:id/edit',
    '/tournaments',
  ],
};
