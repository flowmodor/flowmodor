'use server';

import { nanoid } from 'nanoid';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';

export async function updateOptions(breakRatio: number) {
  const supabase = await createClient();
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

  revalidatePath('/settings');

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
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase
    .from('integrations')
    .update({ todoist: null })
    .eq('user_id', user!.id);

  revalidatePath('/settings');

  return { error };
}

export async function connectTickTick() {
  const url = new URL('https://ticktick.com/oauth/authorize');
  url.searchParams.append('client_id', process.env.TICKTICK_CLIENT_ID);
  url.searchParams.append('scope', 'tasks:write tasks:read');
  url.searchParams.append('response_type', 'code');

  const state = nanoid();
  const cookieStore = cookies();
  cookieStore.set('ticktick_state', state, { maxAge: 60 * 60 });
  url.searchParams.append('state', state);

  redirect(url.toString());
}

export async function disconnectTickTick() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase
    .from('integrations')
    .update({ ticktick: null })
    .eq('user_id', user!.id);

  revalidatePath('/settings');

  return { error };
}
