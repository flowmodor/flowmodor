import { useState } from 'react';
import supabase from '@/utils/supabase';

export default function useChangePassword() {
  const [isLoading, setIsLoading] = useState(false);

  async function changePassword(password: string) {
    setIsLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setIsLoading(false);

    return { error };
  }

  return {
    isLoading,
    changePassword,
  };
}
