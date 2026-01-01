import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_PATHS = ['/auth/sign-in', '/auth/sign-up', '/auth/confirm-email'];
const PROTECTED_PATHS = ['/', '/w']; // extend with other protected prefixes as needed

export function proxy(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl;
  const isAuthRoute = PUBLIC_PATHS.some((path) =>
    pathname.startsWith(path)
  );
  const isProtected =
    !isAuthRoute &&
    PROTECTED_PATHS.some((path) => {
      if (path === '/') return pathname === '/';
      return pathname === path || pathname.startsWith(`${path}/`);
    });

  // Read the NextAuth session token (default cookie names)
  const hasSession =
    req.cookies.has('next-auth.session-token') ||
    req.cookies.has('__Secure-next-auth.session-token');

  if (isProtected && !hasSession) {
    const callbackUrl =
      pathname === '/' && !req.nextUrl.search ? null : req.nextUrl.pathname + req.nextUrl.search;
    const signInUrl = req.nextUrl.clone();
    signInUrl.pathname = '/auth/sign-in';
    if (callbackUrl) {
      signInUrl.searchParams.set('callbackUrl', callbackUrl);
    }
    return NextResponse.redirect(signInUrl);
  }

  if (isAuthRoute && hasSession) {
    const callbackUrl =
      searchParams.get('callbackUrl') ||
      req.headers.get('referer') ||
      '/';
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = callbackUrl.startsWith('/')
      ? callbackUrl
      : '/';
    redirectUrl.search = '';
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api).*)'],
};
