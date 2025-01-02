import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');

  if (code) {
    const cookieStore = await cookies();

    if (
      cookieStore.get('ticktick_state')?.value !== searchParams.get('state')
    ) {
      return NextResponse.redirect(`${origin}/auth/auth-code-error`);
    }

    const url = new URL('https://ticktick.com/oauth/token');
    url.searchParams.append('client_id', process.env.TICKTICK_CLIENT_ID);
    url.searchParams.append(
      'client_secret',
      process.env.TICKTICK_CLIENT_SECRET,
    );
    url.searchParams.append('code', code);
    url.searchParams.append('grant_type', 'authorization_code');

    const response = await fetch(url, { method: 'POST' });
    const { access_token: accessToken } = await response.json();

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.redirect(`${origin}/auth/auth-code-error`);
    }

    const { error } = await supabase
      .from('integrations')
      .update({ ticktick: accessToken })
      .eq('user_id', user.id);

    if (!error && response.ok) {
      return NextResponse.redirect(
        `${origin}/settings?success=TickTick connected successfully! You can now select tasks from TickTick.`,
      );
    }
  }

  return NextResponse.redirect(
    `${origin}/settings?error=Failed to connect TickTick.`,
  );
}
