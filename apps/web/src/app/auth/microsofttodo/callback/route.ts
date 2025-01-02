import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');

  if (code) {
    const cookieStore = await cookies();
    if (
      cookieStore.get('microsofttodo_state')?.value !==
      searchParams.get('state')
    ) {
      return NextResponse.redirect(`${origin}/auth/auth-code-error`);
    }

    const tokenUrl =
      'https://login.microsoftonline.com/common/oauth2/v2.0/token';
    const body = new URLSearchParams({
      client_id: process.env.MICROSOFT_CLIENT_ID,
      client_secret: process.env.MICROSOFT_CLIENT_SECRET,
      code,
      grant_type: 'authorization_code',
      redirect_uri: `${process.env.NEXT_PUBLIC_URL}/auth/microsofttodo/callback`,
    });

    try {
      const response = await fetch(tokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: body.toString(),
      });

      if (!response.ok) {
        throw new Error('Failed to exchange code for tokens');
      }

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
          microsofttodo: {
            access_token: accessToken,
            refresh_token: refreshToken,
          },
        })
        .eq('user_id', user.id);

      if (error) {
        throw new Error('Failed to store tokens');
      }

      return NextResponse.redirect(
        `${origin}/settings?success=Microsoft To Do connected successfully!`,
      );
    } catch (error) {
      console.error('Microsoft Todo integration error:', error);
      return NextResponse.redirect(
        `${origin}/settings?error=Failed to connect Microsoft To Do.`,
      );
    }
  }

  return NextResponse.redirect(
    `${origin}/settings?error=Failed to connect Microsoft To Do.`,
  );
}
