import { Tabs } from 'expo-router';
import { useEffect } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Auth from '@/src/components/Auth';
import { Profile, Stats, Tasks, Timer } from '@/src/components/Icons';
import { useSession } from '@/src/ctx';
import { useTasksActions } from '@/src/hooks/useTasks';
import useTick from '@/src/hooks/useTick';
import { hapticsImpact } from '@/src/utils';

export default function TabLayout() {
  const { fetchSources, fetchListsAndLabels, fetchTasks } = useTasksActions();
  const { session } = useSession();
  const insets = useSafeAreaInsets();
  const paddingBottom = insets.bottom === 0 ? 20 : insets.bottom;

  useTick();

  useEffect(() => {
    fetchSources();
    fetchListsAndLabels();
    fetchTasks();
  }, []);

  if (!session) {
    return <Auth />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#DBBFFF',
        tabBarInactiveTintColor: '#FFFFFF70',
        tabBarStyle: {
          backgroundColor: '#131221',
          borderTopColor: '#3F3E55',
          paddingTop: 20,
          height: 60 + paddingBottom,
          paddingBottom,
        },
      }}
      screenListeners={{
        tabPress: hapticsImpact,
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
        name="tasks"
        options={{
          title: 'Tasks',
          tabBarIcon: ({ color }) => <Tasks fill={color} />,
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          title: 'Stats',
          tabBarIcon: ({ color }) => <Stats fill={color} />,
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
