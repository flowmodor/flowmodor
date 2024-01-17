import { useState } from 'react';
import supabase from '@/utils/supabase';

export default function useSignIn() {
  const [isLoading, setIsLoading] = useState(false);

  async function signIn(email: string, password: string) {
    setIsLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setIsLoading(false);

    return { data, error };
  }

  return {
    isLoading,
    signIn,
  };
}
