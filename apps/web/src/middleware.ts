import { type NextRequest } from 'next/server';
import { updateSession } from '@/utils/supabase/middleware';

export async function middleware(request: NextRequest) {
  // eslint-disable-next-line @typescript-eslint/return-await
  return await updateSession(request);
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|.*\\..*|favicon.ico|auth|webhook).*)',
  ],
};
