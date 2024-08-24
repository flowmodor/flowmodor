import { StyleSheet, View } from 'react-native';
import { Pressable, Text } from '@/src/components/Themed';
import { supabase } from '@/src/utils/supabase';

export default function TabOneScreen() {
  return (
    <View style={styles.container}>
      <Text>Tab One</Text>
      <Pressable
        onPress={() => supabase.auth.signOut()}
        style={{
          position: 'absolute',
          right: 20,
          top: 20,
        }}
      >
        <Text
          style={{
            color: '#000000',
          }}
        >
          Sign Out
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#131221',
    gap: 20,
  },
});
