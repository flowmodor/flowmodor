import { Button, StyleSheet, Text, View } from 'react-native';
import { supabase } from '@/src/utils/supabase';

export default function TabOneScreen() {
  return (
    <View style={styles.container}>
      <Text>Tab One</Text>
      <Button title="Sign Out" onPress={() => supabase.auth.signOut()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
