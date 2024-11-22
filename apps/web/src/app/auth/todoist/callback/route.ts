import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

/* eslint-disable import/prefer-default-export */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');

  if (code) {
    const cookieStore = cookies();

    if (cookieStore.get('todoist_state')?.value !== searchParams.get('state')) {
      return NextResponse.redirect(`${origin}/auth/auth-code-error`);
    }

    const url = new URL('https://todoist.com/oauth/access_token');
    url.searchParams.append('client_id', process.env.TODOIST_CLIENT_ID);
    url.searchParams.append('client_secret', process.env.TODOIST_CLIENT_SECRET);
    url.searchParams.append('code', code);

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
      .update({ todoist: accessToken })
      .eq('user_id', user.id);

    if (!error && response.ok) {
      return NextResponse.redirect(
        `${origin}/settings?success=Todoist connected successfully! You can now select tasks from Todoist.`,
      );
    }
  }

  return NextResponse.redirect(
    `${origin}/settings?error=Failed to connect Todoist.`,
  );
}
