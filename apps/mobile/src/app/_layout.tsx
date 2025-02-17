import { usePathname, useRouter } from 'expo-router';
import { Stack } from 'expo-router/stack';
import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SessionProvider, useSession } from '@/src/ctx';
import BottomSheetComponent from '../components/BottomSheetComponent';
import { BottomSheetProvider } from '../context/BottomSheetContext';

function RootStack() {
  const { session } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (session === 'loading') return;
    if (session && pathname === '/auth') {
      router.replace('/(tabs)');
    } else if (!session && pathname !== '/auth') {
      router.replace('/auth');
    }
  }, [session, pathname, router]);

  if (session === 'loading') {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#131221',
        }}
      >
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'fade',
        contentStyle: {
          backgroundColor: '#131221',
        },
      }}
    >
      <Stack.Screen name="auth" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}

export default function Layout() {
  return (
    <SessionProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <BottomSheetProvider>
          <RootStack />
          <BottomSheetComponent />
        </BottomSheetProvider>
      </GestureHandlerRootView>
    </SessionProvider>
  );
}
