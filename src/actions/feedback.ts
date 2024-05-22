'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { getActionClient } from '@/utils/supabase';

export async function vote(featureId: number) {
  const supabase = getActionClient(cookies());
  await supabase.from('votes').insert({ feature_id: featureId });
  await supabase.rpc('increment_upvotes', { feature_id: featureId });
  revalidatePath('/feedback');
}

export async function unVote(featureId: number) {
  const supabase = getActionClient(cookies());
  await supabase.from('votes').delete().eq('feature_id', featureId);
  await supabase.rpc('decrement_upvotes', { feature_id: featureId });
  revalidatePath('/feedback');
}
