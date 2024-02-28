'use server';

import { nanoid } from 'nanoid';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getActionClient } from '@/utils/supabase';

export async function updateOptions(breakRatio: number) {
  const supabase = getActionClient(cookies());
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: { message: 'User not found' } };
  }

  const { error } = await supabase
    .from('settings')
    .update({ break_ratio: breakRatio })
    .eq('user_id', user.id);

  return { error };
}

export async function connectTodoist() {
  const url = new URL('https://todoist.com/oauth/authorize');
  url.searchParams.append(
    'client_id',
    process.env.NEXT_PUBLIC_TODOIST_CLIENT_ID,
  );
  url.searchParams.append('scope', 'data:read_write');

  const state = nanoid();
  const cookieStore = cookies();
  cookieStore.set('todoist_state', state, { maxAge: 60 * 60 });
  url.searchParams.append('state', state);

  redirect(url.toString());
}

export async function disconnectTodoist() {
  const supabase = getActionClient(cookies());
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase
    .from('integrations')
    .update({ provider: null, access_token: null })
    .eq('user_id', user!.id);

  revalidatePath('/settings');

  return { error };
}
