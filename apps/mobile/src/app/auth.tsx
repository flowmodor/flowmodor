import * as AppleAuthentication from 'expo-apple-authentication';
import { useRouter } from 'expo-router';
import { Platform } from 'react-native';
import { ScrollView, View } from 'react-native';
import { Google } from '@/src/components/Icons';
import { Pressable, Text } from '@/src/components/Themed';
import { useSession } from '@/src/ctx';

export default function Auth() {
  const { signInWithApple, signInWithGoogle } = useSession();
  const router = useRouter();

  return (
    <ScrollView
      style={{ backgroundColor: '#131221' }}
      contentContainerStyle={{
        justifyContent: 'center',
        height: '100%',
        paddingHorizontal: 50,
        gap: 30,
        width: '100%',
        maxWidth: 500,
        alignSelf: 'center',
      }}
    >
      <Text style={{ fontSize: 26, fontWeight: 'bold', textAlign: 'center' }}>
        Sign In Now
      </Text>
      <View style={{ flexDirection: 'column', gap: 10 }}>
        {Platform.OS === 'ios' && (
          <AppleAuthentication.AppleAuthenticationButton
            buttonType={
              AppleAuthentication.AppleAuthenticationButtonType.CONTINUE
            }
            buttonStyle={
              AppleAuthentication.AppleAuthenticationButtonStyle.WHITE
            }
            cornerRadius={8}
            style={{ height: 40 }}
            onPress={async () => await signInWithApple()}
          />
        )}
        <Pressable
          scaleValue={0.98}
          style={{
            backgroundColor: '#ffffff',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            height: 40,
            gap: 6,
          }}
          onPress={async () => {
            await signInWithGoogle();
          }}
        >
          <Google />
          <Text style={{ fontSize: 15, fontWeight: '600', color: '#000000' }}>
            Continue with Google
          </Text>
        </Pressable>
      </View>
      <View style={{ flexDirection: 'column', gap: 10 }}>
        <Pressable
          scaleValue={0.98}
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            height: 40,
            backgroundColor: '#ffffff',
          }}
          onPress={() => router.push('/modal?mode=signin')}
        >
          <Text
            style={{
              color: '#000000',
              fontSize: 15,
              fontWeight: '600',
            }}
          >
            Sign in with Email
          </Text>
        </Pressable>
        <Pressable
          scaleValue={0.98}
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            height: 40,
            backgroundColor: '#ffffff',
          }}
          onPress={() => router.push('/modal?mode=signup')}
        >
          <Text
            style={{
              color: '#000000',
              fontSize: 15,
              fontWeight: '600',
            }}
          >
            Sign up with Email
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
