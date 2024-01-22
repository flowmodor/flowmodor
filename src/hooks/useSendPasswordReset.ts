import { useState } from 'react';
import supabase from '@/utils/supabase';

export default function useSendPasswordReset() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  async function sendPasswordReset(email: string) {
    setIsLoading(true);
    const { data, error } = await supabase.auth.resetPasswordForEmail(email);
    setIsLoading(false);
    if (!error) {
      setIsSent(true);
    }

    return { data, error };
  }

  return {
    isSent,
    isLoading,
    sendPasswordReset,
  };
}
