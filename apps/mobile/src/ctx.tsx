import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import { AuthError, PostgrestError, Session } from '@supabase/supabase-js';
import {
  type PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import { Alert } from 'react-native';
import { supabase } from './utils/supabase';

const AuthContext = createContext<{
  signIn: (email: string, password: string) => Promise<AuthError | null>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<AuthError | null>;
  signUp: (email: string, password: string) => Promise<AuthError | null>;
  deleteAccount: () => Promise<PostgrestError | null>;
  session: Session | null;
}>({
  signIn: () => new Promise(() => null),
  signInWithGoogle: () => new Promise(() => null),
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

    GoogleSignin.configure({
      webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
      iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
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
        signInWithGoogle: async () => {
          try {
            await GoogleSignin.hasPlayServices();
            const { data: userInfo } = await GoogleSignin.signIn();

            if (userInfo?.idToken) {
              const { data, error } = await supabase.auth.signInWithIdToken({
                provider: 'google',
                token: userInfo.idToken,
              });
              if (error) {
                Alert.alert(error.message);
              }
            }
          } catch (error: any) {
            Alert.alert('Please try signing in again.');
          }
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
