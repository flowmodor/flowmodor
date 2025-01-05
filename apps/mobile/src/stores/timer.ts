import { createStore } from '@flowmodor/stores/timer';
import notifee, {
  AndroidImportance,
  AndroidVisibility,
  EventType,
  TimestampTrigger,
  TriggerType,
} from '@notifee/react-native';
import { store as statsStore } from '@/src/stores/stats';
import { supabase } from '@/src/utils/supabase';

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

export const store = createStore(
  supabase,
  statsStore,
  setupBreakTimerNotification,
);
