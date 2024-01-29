import { NextResponse, type NextRequest } from 'next/server';
import { getMiddlewareClient } from './utils/supabase';

export async function middleware(request: NextRequest) {
  const { supabase, response } = getMiddlewareClient(request);
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (
    session === null &&
    request.nextUrl.pathname !== '/signin' &&
    request.nextUrl.pathname !== '/signup' &&
    request.nextUrl.pathname !== '/forgot-password'
  ) {
    return NextResponse.redirect(new URL('/signin', request.url));
  }

  if (
    session !== null &&
    (request.nextUrl.pathname === '/signin' ||
      request.nextUrl.pathname === '/signup' ||
      request.nextUrl.pathname === '/forgot-password')
  ) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|.*\\..*|favicon.ico|auth|webhook).*)',
  ],
};
