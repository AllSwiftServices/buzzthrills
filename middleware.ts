import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Define Protected Routes
  const isAdminRoute = pathname.startsWith('/admin');
  const isBookingRoute = pathname.startsWith('/book') || pathname.startsWith('/checkout');
  const isProfileRoute = pathname.startsWith('/profile');

  if (isAdminRoute || isBookingRoute || isProfileRoute) {
    const accessToken = request.cookies.get('access_token')?.value;

    if (!accessToken) {
      // Redirect to login if no token
      const url = new URL('/auth', request.url);
      url.searchParams.set('redirect', pathname);
      return NextResponse.redirect(url);
    }

    const payload = await verifyToken(accessToken);

    if (!payload) {
      // Token invalid or expired
      const url = new URL('/auth', request.url);
      url.searchParams.set('redirect', pathname);
      return NextResponse.redirect(url);
    }

    // 2. Role-Based Access Control (RBAC) for Admin
    if (isAdminRoute && payload.role !== 'admin') {
      return NextResponse.redirect(new URL('/profile', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/book',
    '/book/:path*',
    '/checkout',
    '/checkout/:path*',
    '/profile',
    '/profile/:path*',
  ],
};
