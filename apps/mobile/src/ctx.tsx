import { Session } from '@supabase/supabase-js';
import {
  type PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import { supabase } from './utils/supabase';

const AuthContext = createContext<{
  signIn: (email: string, password: string) => void;
  signOut: () => void;
  session: Session | null;
}>({
  signIn: () => null,
  signOut: () => null,
  session: null,
});

// This hook can be used to access the user info.
export function useSession() {
  const value = useContext(AuthContext);
  if (process.env.NODE_ENV !== 'production') {
    if (!value) {
      throw new Error('useSession must be wrapped in a <SessionProvider />');
    }
  }

  return value;
}

export function SessionProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        signIn: async (email, password) => {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          console.log(data, error);
          // TODO: Handle error
        },
        signOut: async () => {
          const { error } = await supabase.auth.signOut();
          console.log(error);
          // TODO: Handle error
        },
        session,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
