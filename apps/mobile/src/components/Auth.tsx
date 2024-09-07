import { useState } from 'react';
import { Alert, ScrollView, View } from 'react-native';
import { Pressable, Text, TextInput } from '@/src/components/Themed';
import { useSession } from '@/src/ctx';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { signIn } = useSession();

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
          fontSize: 22,
          fontWeight: 'bold',
          textAlign: 'center',
        }}
      >
        Sign in to save your focus sessions!
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
          const error = await signIn(email, password);

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
          Sign in
        </Text>
      </Pressable>
      <Text
        style={{
          textAlign: 'center',
        }}
      >
        Don't have an account?{' '}
        <Text style={{ fontWeight: 'bold' }}>Sign up here</Text>
      </Text>
    </ScrollView>
  );
}
