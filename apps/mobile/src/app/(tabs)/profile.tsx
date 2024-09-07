import { useState } from 'react';
import { Alert, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Auth from '@/src/components/Auth';
import { Bars } from '@/src/components/Icons';
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
