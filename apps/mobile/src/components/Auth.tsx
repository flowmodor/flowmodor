import { useState } from 'react';
import { Alert, ScrollView, View } from 'react-native';
import { Pressable, Text, TextInput } from '@/src/components/Themed';
import { useSession } from '@/src/ctx';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');

  const { signIn, signUp } = useSession();

  return (
    <ScrollView
      style={{
        backgroundColor: '#131221',
      }}
      contentContainerStyle={{
        justifyContent: 'center',
        height: '100%',
        flex: 1,
        backgroundColor: '#131221',
        paddingHorizontal: 50,
        gap: 30,
      }}
    >
      <Text
        style={{
          fontSize: 26,
          fontWeight: 'bold',
          textAlign: 'center',
        }}
      >
        {mode === 'signin' ? 'Sign In Now' : 'Get started'}
      </Text>
      <View
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
        }}
      >
        <View
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 5,
          }}
        >
          <Text>Email</Text>
          <TextInput
            placeholder="you@example.com"
            value={email}
            onChangeText={setEmail}
            inputMode="email"
          />
        </View>
        <View
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 5,
          }}
        >
          <Text>Password</Text>
          <TextInput
            placeholder="••••••••"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>
      </View>
      <Pressable
        scaleValue={0.98}
        isLoading={isLoading}
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          height: 40,
        }}
        onPress={async () => {
          setIsLoading(true);
          let error: Error | null = null;

          if (mode === 'signup') {
            error = await signUp(email, password);
            if (!error) {
              Alert.alert('Verification email sent. Please verify your email.');
              setMode('signin');
            }
          } else {
            error = await signIn(email, password);
          }

          if (error) {
            Alert.alert(error.message);
            setIsLoading(false);
            return;
          }

          setEmail('');
          setPassword('');
          setIsLoading(false);
        }}
      >
        <Text
          style={{
            color: '#000000',
          }}
        >
          {mode === 'signin' ? 'Sign In' : 'Sign Up'}
        </Text>
      </Pressable>
      <Text
        style={{
          textAlign: 'center',
        }}
      >
        {mode === 'signin' ? (
          <>
            Don't have an account?{' '}
            <Text
              style={{ fontWeight: 'bold' }}
              onPress={() => setMode('signup')}
            >
              Sign up here
            </Text>
          </>
        ) : (
          <>
            Already have an account?{' '}
            <Text
              style={{ fontWeight: 'bold' }}
              onPress={() => setMode('signin')}
            >
              Sign in now
            </Text>
          </>
        )}
      </Text>
    </ScrollView>
  );
}
