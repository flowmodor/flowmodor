'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/utils/supabase/server';

// eslint-disable-next-line import/prefer-default-export
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
