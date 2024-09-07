import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Pressable, Text, TextInput } from '@/src/components/Themed';
import { useSession } from '@/src/ctx';

export default function Profile() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { session, signIn, signOut } = useSession();

  if (session) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          height: '100%',
          backgroundColor: '#131221',
          alignItems: 'center',
          gap: 20,
        }}
      >
        <Text>Signed in as: {session.user?.email}</Text>
        <Pressable onPress={signOut}>
          <Text
            style={{
              color: '#000000',
            }}
          >
            Sign out
          </Text>
        </Pressable>
      </View>
    );
  }

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
          fontSize: 32,
          fontWeight: 'bold',
          alignSelf: 'center',
        }}
      >
        Sign In Now
      </Text>
      <View
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
        }}
      >
        <TextInput
          placeholder="you@example.com"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          placeholder="••••••••"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>
      <Pressable
        style={{
          alignItems: 'center',
        }}
        onPress={() => {
          signIn(email, password);
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
    </ScrollView>
  );
}
