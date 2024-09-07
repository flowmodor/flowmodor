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
  const [isLoading, setIsLoading] = useState(false);

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
            width: '100%',
            alignItems: 'center',
            justifyContent: 'flex-end',
          }}
        >
          <Pressable
            isLoading={isLoading}
            color="#DBBFFF"
            style={{
              backgroundColor: '#3F3E55',
            }}
            onPress={async () => {
              setIsLoading(true);
              const error = await signOut();

              if (error) {
                Alert.alert(error.message);
              }
              setIsLoading(false);
            }}
          >
            <Text style={{}}>Sign out</Text>
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
              fontSize: 18,
              maxWidth: 200,
              textAlign: 'center',
            }}
          >
            Focus report will be available soon!
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
    </ScrollView>
  );
}
