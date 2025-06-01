import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define public (unauthenticated) routes
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

// Main middleware logic
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get('accessToken')?.value;

  // Skip static files and _next
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Allow access to public paths
  if (PUBLIC_PATHS.some((publicPath) => pathname.startsWith(publicPath))) {
    return NextResponse.next();
  }

  // Check for protected path
  const isProtectedRoute = pathname.startsWith('/w');

  // If protected and no token, redirect to sign-in
  if (isProtectedRoute && !accessToken) {
    const signInUrl = new URL('/auth/sign-in', request.url);
    signInUrl.searchParams.set('redirect', pathname); // Preserve intended destination
    return NextResponse.redirect(signInUrl);
  }

  // Token exists or route is not protected
  return NextResponse.next();
}

// Match only protected routes
export const config = {
  matcher: [
    /*
      Match all paths under /w/ (e.g., /w/my-workspace/classes)
      Feel free to expand this list with other protected route patterns
    */
    '/w/:slug*',
  ],
};
