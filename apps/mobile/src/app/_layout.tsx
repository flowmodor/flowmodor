import { Stack } from 'expo-router/stack';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SessionProvider } from '@/src/ctx';
import BottomSheetComponent from '../components/BottomSheetComponent';
import { BottomSheetProvider } from '../context/BottomSheetContext';

export default function Layout() {
  return (
    <SessionProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <BottomSheetProvider>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          </Stack>
          <BottomSheetComponent />
        </BottomSheetProvider>
      </GestureHandlerRootView>
    </SessionProvider>
  );
}
