import { AuthError, PostgrestError, Session } from '@supabase/supabase-js';
import {
  type PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import { supabase } from './utils/supabase';

const AuthContext = createContext<{
  signIn: (email: string, password: string) => Promise<AuthError | null>;
  signOut: () => Promise<AuthError | null>;
  signUp: (email: string, password: string) => Promise<AuthError | null>;
  deleteAccount: () => Promise<PostgrestError | null>;
  session: Session | null;
}>({
  signIn: () => new Promise(() => null),
  signOut: () => new Promise(() => null),
  signUp: () => new Promise(() => null),
  deleteAccount: () => new Promise(() => null),
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
          const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          return error;
        },
        signOut: async () => {
          const { error } = await supabase.auth.signOut();
          return error;
        },
        signUp: async (email, password) => {
          const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                mobile: true,
              },
            },
          });
          return error;
        },
        deleteAccount: async () => {
          const { error } = await supabase.rpc('delete_account');

          if (!error) {
            setSession(null);
          }

          return error;
        },
        session,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
