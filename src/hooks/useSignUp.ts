import { useState } from 'react';
import supabase from '@/utils/supabase';

export default function useSignUp() {
  const [isLoading, setIsLoading] = useState(false);

  async function signUp(email: string, password: string) {
    setIsLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    setIsLoading(false);

    return { data, error };
  }

  return {
    isLoading,
    signUp,
  };
}
