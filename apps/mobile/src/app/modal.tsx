import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, View } from 'react-native';
import { Pressable, Text, TextInput } from '@/src/components/Themed';
import { useSession } from '@/src/ctx';

export default function EmailAuthModal() {
  const { mode } = useLocalSearchParams<{ mode: 'signin' | 'signup' }>();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, signUp } = useSession();

  const handleAuth = async () => {
    setIsLoading(true);
    let error: Error | null = null;
    if (mode === 'signup') {
      error = await signUp(email, password);
      if (!error) {
        Alert.alert('Verification email sent. Please verify your email.');
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
    router.back();
  };

  return (
    <View style={{ paddingHorizontal: 15, gap: 10 }}>
      <Text
        style={{
          fontSize: 26,
          fontWeight: 'bold',
          marginVertical: 20,
        }}
      >
        {mode === 'signin' ? 'Sign In' : 'Sign Up'}
      </Text>
      <View style={{ gap: 5 }}>
        <Text>Email</Text>
        <TextInput
          autoFocus
          placeholder="you@example.com"
          value={email}
          onChangeText={setEmail}
          inputMode="email"
        />
      </View>
      <View style={{ gap: 5 }}>
        <Text>Password</Text>
        <TextInput
          placeholder="••••••••"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>
      <Pressable
        scaleValue={0.98}
        isLoading={isLoading}
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          height: 40,
          marginTop: 30,
        }}
        onPress={handleAuth}
      >
        <Text
          style={{
            color: '#000000',
            fontWeight: '500',
            fontSize: 16,
          }}
        >
          {mode === 'signin' ? 'Sign In' : 'Sign Up'}
        </Text>
      </Pressable>
    </View>
  );
}
