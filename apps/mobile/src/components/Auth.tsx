import { useState } from 'react';
import { Alert, AppState, StyleSheet, View } from 'react-native';
import { supabase } from '../utils/supabase';
import { Pressable, Text, TextInput } from './Themed';

AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function signInWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) Alert.alert(error.message);
    setLoading(false);
  }

  async function signUpWithEmail() {
    setLoading(true);
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) {
      Alert.alert(error.message);
    }

    if (!session) {
      Alert.alert('Please check your inbox for email verification!');
    }
    setLoading(false);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign In Now</Text>
      <View>
        <TextInput
          onChangeText={(text) => setEmail(text)}
          value={email}
          placeholder="you@example.com"
          autoCapitalize={'none'}
        />
      </View>
      <View>
        <TextInput
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry={true}
          placeholder="••••••••"
          autoCapitalize={'none'}
        />
      </View>
      <View>
        <Pressable
          disabled={loading}
          onPress={() => signInWithEmail()}
          style={{
            marginTop: 20,
          }}
        >
          <Text
            style={{
              color: '#000000',
              alignSelf: 'center',
            }}
          >
            Sign In
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
    alignSelf: 'center',
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#131221',
    height: '100%',
    gap: 10,
  },
});
