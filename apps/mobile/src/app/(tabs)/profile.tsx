import { useState } from 'react';
import { Alert, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Bars } from '@/src/components/Icons';
import { Pressable, Text, TextInput } from '@/src/components/Themed';
import { useSession } from '@/src/ctx';

export default function Profile() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { session, signIn, signOut } = useSession();

  const insets = useSafeAreaInsets();

  if (session) {
    return (
      <View
        style={{
          flex: 1,
          height: '100%',
          backgroundColor: '#131221',
          alignItems: 'center',
          paddingTop: insets.top,
          paddingHorizontal: 20,
          gap: 20,
        }}
      >
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '100%',
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              fontWeight: 'semibold',
            }}
          >
            Hi, {session.user?.email}
          </Text>
          <Pressable
            style={{
              backgroundColor: '#00000000',
            }}
            onPress={async () => {
              const error = await signOut();

              if (error) {
                Alert.alert(error.message);
              }
            }}
          >
            <Text
              style={{
                color: '#DBBFFF',
              }}
            >
              Sign out
            </Text>
          </Pressable>
        </View>
        <View
          style={{
            marginVertical: 'auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 20,
          }}
        >
          <Bars />
          <Text
            style={{
              fontWeight: 'bold',
            }}
          >
            Stats coming soon!
          </Text>
        </View>
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
          inputMode="email"
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
        onPress={async () => {
          const error = await signIn(email, password);

          if (error) {
            Alert.alert(error.message);
            return;
          }

          setEmail('');
          setPassword('');
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
