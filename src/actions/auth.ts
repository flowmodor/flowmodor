'use server';

import { cookies } from 'next/headers';
import { getActionClient } from '@/utils/supabase';

/* eslint-disable import/prefer-default-export */
export async function sendPasswordReset(email: string) {
  const supabase = getActionClient(cookies());
  const { error } = await supabase.auth.resetPasswordForEmail(email);
  return { error };
}
