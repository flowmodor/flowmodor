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

export async function signUp(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const supabase = getActionClient(cookies());
  const { error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    redirect(`/signup?error=${error.message}`);
  }
  redirect(
    '/signin?success=Sign up successfully! Check your email to verify your account.',
  );
}

export async function signOut() {
  const supabase = getActionClient(cookies());
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error('Error signing out:', error);
  }
  redirect('/signin');
}
