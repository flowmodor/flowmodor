import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

// eslint-disable-next-line import/prefer-default-export
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');

  if (code) {
    const cookieStore = cookies();
    if (
      cookieStore.get('googletasks_state')?.value !== searchParams.get('state')
    ) {
      return NextResponse.redirect(`${origin}/auth/auth-code-error`);
    }

    const url = new URL('https://oauth2.googleapis.com/token');

    url.searchParams.append('client_id', process.env.GOOGLE_CLIENT_ID);
    url.searchParams.append('client_secret', process.env.GOOGLE_CLIENT_SECRET);
    url.searchParams.append('code', code);
    url.searchParams.append('grant_type', 'authorization_code');
    url.searchParams.append(
      'redirect_uri',
      `${process.env.NEXT_PUBLIC_URL}/auth/googletasks/callback`,
    );

    const response = await fetch(url, { method: 'POST' });
    const { access_token: accessToken, refresh_token: refreshToken } =
      await response.json();

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.redirect(`${origin}/auth/auth-code-error`);
    }

    const { error } = await supabase
      .from('integrations')
      .update({
        googletasks: {
          access_token: accessToken,
          refresh_token: refreshToken,
        },
      })
      .eq('user_id', user.id);

    if (!error && response.ok) {
      return NextResponse.redirect(
        `${origin}/settings?success=Google Tasks connected successfully!`,
      );
    }
  }

  return NextResponse.redirect(
    `${origin}/settings?error=Failed to connect Google Tasks.`,
  );
}
