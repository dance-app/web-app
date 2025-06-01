import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_PATHS = [
  '/auth/sign-in',
  '/auth/sign-up',
  '/auth/forgot-password',
  '/auth/confirm-email',
  '/api/auth/sign-in',
  '/api/auth/sign-up',
  '/api/auth/verify-email',
  '/api/auth/me',
  '/api/auth/forgot-password',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get('accessToken')?.value;

  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  if (PUBLIC_PATHS.some((publicPath) => pathname.startsWith(publicPath))) {
    return NextResponse.next();
  }

  const isProtectedRoute = pathname.startsWith('/w');
  if (isProtectedRoute && !accessToken) {
    const signInUrl = new URL('/auth/sign-in', request.url);
    signInUrl.searchParams.set('redirect', pathname); // Preserve intended destination
    return NextResponse.redirect(signInUrl);
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
      Match all paths under /w/ (e.g., /w/my-workspace/classes)
      Feel free to expand this list with other protected route patterns
    */
    '/w/:slug*',
  ],
};
