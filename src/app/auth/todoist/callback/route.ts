import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

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
    url.searchParams.append(
      'client_id',
      process.env.NEXT_PUBLIC_TODOIST_CLIENT_ID,
    );
    url.searchParams.append(
      'client_secret',
      process.env.NEXT_PUBLIC_TODOIST_CLIENT_SECRET,
    );
    url.searchParams.append('code', code);

    const response = await fetch(url, { method: 'POST' });
    const data = await response.json();
    console.log(data);

    if (response.ok) {
      return NextResponse.redirect(`${origin}/settings`);
    }
  }

  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
