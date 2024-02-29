'use server';

import { Provider } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getActionClient } from '@/utils/supabase';

/* eslint-disable import/prefer-default-export */
export async function sendPasswordReset(email: string) {
  const supabase = getActionClient(cookies());
  const { error } = await supabase.auth.resetPasswordForEmail(email);
  return { error };
}

export async function signInWithPassword(email: string, password: string) {
  const supabase = getActionClient(cookies());
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (!error) {
    redirect('/');
  }

  return { error };
}

export async function signInWithOAuth(origin: string, provdier: Provider) {
  const supabase = getActionClient(cookies());
  const { error } = await supabase.auth.signInWithOAuth({
    provider: provdier,
    options: {
      redirectTo: `${origin}/auth/callback`,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  });

  if (!error) {
    return { error: null };
  }

  return { error };
}
