/* eslint-disable import/prefer-default-export */
import { type EmailOtpType } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { getRouteClient } from '@/utils/supabase';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const tokenHash = searchParams.get('token_hash');
  const type = searchParams.get('type') as EmailOtpType | null;
  const next = searchParams.get('next') ?? '/';
  const redirectTo = request.nextUrl.clone();
  redirectTo.pathname = next;

  if (tokenHash && type) {
    const cookieStore = cookies();
    const supabase = getRouteClient(cookieStore);

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash: tokenHash,
    });
    if (!error) {
      return NextResponse.redirect(redirectTo);
    }
  }

  redirectTo.pathname = '/auth/auth-code-error';
  return NextResponse.redirect(redirectTo);
}
