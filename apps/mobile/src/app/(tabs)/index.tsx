import { StyleSheet, View } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { Pressable, Text } from '@/src/components/Themed';
import { supabase } from '@/src/utils/supabase';

export default function TabOneScreen() {
  return (
    <View style={styles.container}>
      <AnimatedCircularProgress
        size={280}
        width={32}
        fill={10}
        rotation={0}
        tintColor="#DBBFFF"
        backgroundColor="#3F3E55"
        lineCap="round"
      >
        {() => (
          <View
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={styles.time}>00:00</Text>
            <Text style={styles.mode}>Focus</Text>
          </View>
        )}
      </AnimatedCircularProgress>
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
  time: {
    fontSize: 44,
    fontWeight: 'bold',
  },
  mode: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});
