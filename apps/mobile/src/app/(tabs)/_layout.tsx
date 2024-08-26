import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Session } from '@supabase/supabase-js';
import { Tabs } from 'expo-router';
import { useEffect, useState } from 'react';
import Auth from '@/src/components/Auth';
import { supabase } from '@/src/utils/supabase';

export default function TabLayout() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  if (session && session.user) {
    return (
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: '#23223C',
            borderTopWidth: 0,
            height: 60,
          },
          tabBarItemStyle: {
            paddingVertical: 10,
          },
          tabBarActiveTintColor: '#FFFFFF',
          tabBarInactiveTintColor: '#FFFFFF70',
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Timer',
            tabBarIcon: ({ color }) => (
              <MaterialIcons name="timer" size={28} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="two"
          options={{
            title: 'Tasks',
            tabBarIcon: ({ color }) => (
              <MaterialIcons
                name="format-list-numbered"
                size={28}
                color={color}
              />
            ),
          }}
        />
      </Tabs>
    );
  }

  return <Auth />;
}
