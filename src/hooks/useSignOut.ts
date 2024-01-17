import supabase from '@/utils/supabase';

export default function useSignOut() {
  async function signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
  }

  return {
    signOut,
  };
}
