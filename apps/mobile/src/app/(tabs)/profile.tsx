import { Link } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Auth from '@/src/components/Auth';
import { External } from '@/src/components/Icons';
import { Pressable, Text } from '@/src/components/Themed';
import { useSession } from '@/src/ctx';

export default function Profile() {
  const { session, signOut } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  const insets = useSafeAreaInsets();

  if (!session) {
    return <Auth />;
  }

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
          flexDirection: 'column',
          gap: 20,
        }}
      >
        <Text style={styles.sectionTitle}>General</Text>
        <Link href="https://app.flowmodor.com/stats">
          <View style={[styles.sectionItem, { width: '100%' }]}>
            <Text style={styles.text}>View your focus stats on the web</Text>
            <External />
          </View>
        </Link>
        <Text style={styles.sectionTitle}>Profile</Text>
        <View style={styles.sectionItem}>
          <Text style={styles.text}>Email</Text>
          <Text style={styles.text}>{session.user.email}</Text>
        </View>
        <Pressable
          isLoading={isLoading}
          color="#131221"
          style={{
            backgroundColor: '#DBBFFF',
            borderColor: '#DBBFFF',
            borderWidth: 2,
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
          <Text
            style={[
              styles.text,
              {
                textAlign: 'center',
                color: '#131221',
              },
            ]}
          >
            Sign out
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  sectionItem: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    backgroundColor: '#23223C',
    padding: 20,
    borderRadius: 10,
  },
  text: {
    fontSize: 16,
  },
});
