'use server';

import { nanoid } from 'nanoid';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';

export async function connect() {
  const url = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  url.searchParams.append('client_id', process.env.GOOGLE_CLIENT_ID);
  url.searchParams.append(
    'redirect_uri',
    `${process.env.NEXT_PUBLIC_URL}/auth/googletasks/callback`,
  );
  url.searchParams.append('response_type', 'code');
  url.searchParams.append('scope', 'https://www.googleapis.com/auth/tasks');
  url.searchParams.append('access_type', 'offline');
  url.searchParams.append('prompt', 'consent');

  const state = nanoid();
  const cookieStore = await cookies();
  cookieStore.set('googletasks_state', state, { maxAge: 60 * 60 });
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
    .update({ googletasks: null })
    .eq('user_id', user!.id);

  revalidatePath('/settings');
  return { error };
}

export async function refreshToken(token: string): Promise<string> {
  const supabase = await createClient();

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      refresh_token: token,
      grant_type: 'refresh_token',
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to refresh access token');
  }

  const data = await response.json();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase
    .from('integrations')
    .update({
      googletasks: {
        access_token: data.access_token,
        refresh_token: token,
      },
    })
    .eq('user_id', user!.id);

  if (error) {
    throw new Error('Failed to update token in database');
  }

  return data.access_token;
}
