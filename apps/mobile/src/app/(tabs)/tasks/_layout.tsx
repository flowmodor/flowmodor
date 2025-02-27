import { Stack } from 'expo-router';

export const hideTabBar = true;

export default function TasksLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: '#131221' },
        headerTintColor: '#DBBFFF',
        headerTitleStyle: { color: '#FFFFFF' },
      }}
    />
  );
}
