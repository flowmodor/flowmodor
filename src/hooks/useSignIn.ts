import { Provider } from '@supabase/supabase-js';
import { useState } from 'react';
import supabase from '@/utils/supabase';

export default function useSignIn() {
  const [isLoading, setIsLoading] = useState(false);

  async function signInWithPassword(email: string, password: string) {
    setIsLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setIsLoading(false);
    }

    return { data, error };
  }

  async function signInWithOAuth(provdier: Provider) {
    setIsLoading(true);
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: provdier,
      options: {
        // eslint-disable-next-line no-restricted-globals
        redirectTo: `${location.origin}/auth/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });

    if (error) {
      setIsLoading(false);
    }

    return { data, error };
  }

  return {
    isLoading,
    signInWithPassword,
    signInWithOAuth,
  };
}
