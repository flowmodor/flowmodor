import * as Haptics from 'expo-haptics';
import { Tabs } from 'expo-router';
import { Profile, Timer } from '@/src/components/Icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#DBBFFF',
        tabBarInactiveTintColor: '#FFFFFF70',
        tabBarStyle: {
          backgroundColor: '#131221',
          borderTopColor: '#3F3E55',
          paddingTop: 10,
          height: 90,
        },
      }}
      screenListeners={{
        tabPress: () => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Timer',
          tabBarIcon: ({ color }) => <Timer fill={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <Profile fill={color} />,
        }}
      />
    </Tabs>
  );
}
