'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getActionClient } from '@/utils/supabase';

export async function sendPasswordReset(formData: FormData) {
  const email = formData.get('email') as string;
  const supabase = getActionClient(cookies());
  const { error } = await supabase.auth.resetPasswordForEmail(email);
  if (error) {
    redirect(`/forgot-password?error=${error.message}`);
  }
  redirect("/signin?success=You've been emailed a password reset link!");
}

export async function signUp(email: string, password: string) {
  const supabase = getActionClient(cookies());
  const { error } = await supabase.auth.signUp({
    email,
    password,
  });

  return { error };
}

export async function signOut() {
  const supabase = getActionClient(cookies());
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error('Error signing out:', error);
  }
  redirect('/signin');
}
