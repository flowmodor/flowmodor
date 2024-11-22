'use server';

import { nanoid } from 'nanoid';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';

export async function connect() {
  const url = new URL(
    'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
  );

  url.searchParams.append('client_id', process.env.MICROSOFT_CLIENT_ID);
  url.searchParams.append(
    'redirect_uri',
    `${process.env.NEXT_PUBLIC_URL}/auth/microsofttodo/callback`,
  );
  url.searchParams.append('response_type', 'code');
  url.searchParams.append('scope', 'offline_access Tasks.ReadWrite');
  url.searchParams.append('response_mode', 'query');

  const state = nanoid();
  const cookieStore = cookies();
  cookieStore.set('microsofttodo_state', state, { maxAge: 60 * 60 });
  url.searchParams.append('state', state);

  redirect(url.toString());
}

export async function disconnect() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase
    .from('integrations')
    .update({ microsofttodo: null })
    .eq('user_id', user!.id);

  revalidatePath('/settings');
  return { error };
}

export async function refreshToken(token: string): Promise<string> {
  const tokenUrl = 'https://login.microsoftonline.com/common/oauth2/v2.0/token';

  const body = new URLSearchParams({
    client_id: process.env.MICROSOFT_CLIENT_ID!,
    client_secret: process.env.MICROSOFT_CLIENT_SECRET!,
    refresh_token: token,
    grant_type: 'refresh_token',
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
      throw new Error('Failed to refresh token');
    }

    const { access_token: accessToken, refresh_token: newRefreshToken } =
      await response.json();

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('User not found');
    }

    const { error } = await supabase
      .from('integrations')
      .update({
        microsofttodo: {
          access_token: accessToken,
          refresh_token: newRefreshToken,
        },
      })
      .eq('user_id', user.id);

    if (error) {
      throw new Error('Failed to update tokens');
    }

    return accessToken;
  } catch (error) {
    console.error('Error refreshing Microsoft Todo token:', error);
    throw new Error('Failed to refresh access token');
  }
}
