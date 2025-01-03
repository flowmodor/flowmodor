import { createHooks, createStore } from '@flowmodor/stores/timer';
import notifee, {
  AndroidImportance,
  AndroidVisibility,
  EventType,
  TimestampTrigger,
  TriggerType,
} from '@notifee/react-native';
import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabase';
import { store as statsStore } from './useStatsStore';

notifee.onBackgroundEvent(async ({ type, detail }) => {
  const { notification, pressAction } = detail;

  if (type === EventType.ACTION_PRESS && pressAction.id === 'mark-as-read') {
    await notifee.cancelNotification(notification.id);
  }
});

async function setupBreakTimerNotification(totalTime: number) {
  await notifee.requestPermission();

  const channelId = await notifee.createChannel({
    id: 'important',
    name: 'Default Channel',
    importance: AndroidImportance.HIGH,
    visibility: AndroidVisibility.PUBLIC,
    sound: 'alarm',
  });

  const trigger: TimestampTrigger = {
    type: TriggerType.TIMESTAMP,
    timestamp: Date.now() + totalTime + 1000,
    alarmManager: {
      allowWhileIdle: true,
    },
  };

  await notifee.createTriggerNotification(
    {
      title: 'Flowmodor',
      body: 'Time to get back to work!',
      ios: {
        sound: 'alarm.wav',
      },
      android: {
        channelId,
        pressAction: {
          id: 'default',
        },
        sound: 'alarm',
        importance: AndroidImportance.HIGH,
        visibility: AndroidVisibility.PUBLIC,
        lightUpScreen: true,
      },
    },
    trigger,
  );
}

export const useBreakRatio = () => {
  const [breakRatio, setBreakRatio] = useState<number>(5);
  useEffect(() => {
    (async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        setBreakRatio(5);
        return;
      }

      const { data } = await supabase
        .from('settings')
        .select('break_ratio')
        .single();
      setBreakRatio(data?.break_ratio || 5);
    })();
  }, []);
  return breakRatio;
};

const store = createStore(supabase, statsStore, setupBreakTimerNotification);
export const {
  useStartTime,
  useEndTime,
  useTotalTime,
  useDisplayTime,
  useMode,
  useStatus,
  useActions,
} = createHooks(store);
