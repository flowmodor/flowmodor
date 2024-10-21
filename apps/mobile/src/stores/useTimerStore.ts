import * as Notifications from 'expo-notifications';
import { useEffect, useState } from 'react';
import { create } from 'zustand';
import { supabase } from '../utils/supabase';
import { useStatsStore } from './useStatsStore';

interface Task {
  id: number;
  name: string;
  completed: boolean;
  labels?: string[];
  due?: Date | null;
}

interface State {
  startTime: number | null;
  endTime: number | null;
  totalTime: number;
  displayTime: number;
  mode: 'focus' | 'break';
  status: 'idle' | 'running' | 'paused';
}

interface Action {
  startTimer: () => Promise<void>;
  stopTimer: (focusingTask?: Task | null, activeList?: string) => Promise<void>;
  pauseTimer: (
    focusingTask?: Task | null,
    activeList?: string,
  ) => Promise<void>;
  resumeTimer: () => Promise<void>;
  log: (focusingTask?: Task | null, activeList?: string) => Promise<void>;
  tickTimer: () => void;
}

interface Store extends State {
  actions: Action;
}

Notifications.setNotificationChannelAsync('timer', {
  name: 'Timer notifications',
  importance: Notifications.AndroidImportance.HIGH,
  sound: 'alarm.wav',
});

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

async function getBreakRatio() {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return 5;
  }

  const { data } = await supabase
    .from('settings')
    .select('break_ratio')
    .single();
  return data?.break_ratio || 5;
}

const useTimerStore = create<Store>((set, get) => ({
  startTime: null,
  endTime: null,
  totalTime: 0,
  displayTime: 0,
  mode: 'focus',
  status: 'idle',
  actions: {
    startTimer: async () => {
      set((state) => ({
        startTime: Date.now(),
        endTime:
          state.mode === 'break' ? Date.now() + state.totalTime : state.endTime,
        status: 'running',
      }));

      if (get().mode === 'break') {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: 'Flowmodor',
            body: 'Time to get back to work!',
            sound: 'alarm.wav',
          },
          trigger: {
            seconds: get().totalTime / 1000 + 1,
            channelId: 'timer',
          },
        });
      }
    },
    stopTimer: async (focusingTask, activeList) => {
      const breakRatio = await getBreakRatio();

      if (get().status === 'paused') {
        const totalTime = get().totalTime / breakRatio;
        set((state) => ({
          totalTime,
          displayTime: Math.floor(totalTime / 1000),
          mode: state.mode === 'focus' ? 'break' : 'focus',
          status: 'idle',
        }));
        return;
      }

      if (get().mode === 'break') {
        await Notifications.cancelAllScheduledNotificationsAsync();
      }

      await get().actions.log(focusingTask, activeList);
      set((state) => {
        const totalTime =
          state.mode === 'focus'
            ? (state.totalTime + Date.now() - state.startTime!) / breakRatio
            : 0;
        return {
          endTime: Date.now(),
          totalTime,
          displayTime: Math.floor(totalTime / 1000),
          mode: state.mode === 'focus' ? 'break' : 'focus',
          status: 'idle',
        };
      });
    },
    pauseTimer: async (focusingTask, activeList) => {
      await get().actions.log(focusingTask, activeList);

      set((state) => {
        const totalTime = state.totalTime + Date.now() - state.startTime!;
        return {
          status: 'paused',
          totalTime,
        };
      });
    },
    resumeTimer: async () => {
      set(() => ({
        status: 'running',
        startTime: Date.now(),
      }));
    },
    log: async (focusingTask, activeList) => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        return;
      }

      const start_time = new Date(get().startTime!).toISOString();
      const end_time = new Date(Date.now()).toISOString();
      const { mode } = get();

      if (mode === 'break') {
        return;
      }

      if (!focusingTask) {
        await supabase.from('logs').insert([
          {
            start_time,
            end_time,
          },
        ]);
        await useStatsStore.getState().actions.updateLogs();
        return;
      }

      const hasId = activeList === 'Flowmodor - default';
      await supabase.from('logs').insert([
        {
          start_time,
          end_time,
          task_id: hasId ? focusingTask.id : null,
          task_name: hasId ? null : focusingTask.name,
        },
      ]);

      await useStatsStore.getState().actions.updateLogs();
    },
    tickTimer: async () => {
      set((state) => {
        if (state.status !== 'running') {
          return {};
        }

        const time =
          state.mode === 'focus'
            ? state.totalTime + Date.now() - state.startTime!
            : state.endTime! - Date.now();

        if (state.mode === 'break' && time <= 0) {
          state.actions.stopTimer();

          return {
            status: 'idle',
            displayTime: 0,
          };
        }

        return {
          displayTime: Math.floor(time / 1000),
        };
      });
    },
  },
}));

export const useBreakRatio = () => {
  const [breakRatio, setBreakRatio] = useState<number>(5);
  useEffect(() => {
    (async () => {
      setBreakRatio(await getBreakRatio());
    })();
  }, []);
  return breakRatio;
};
export const useStartTime = () => useTimerStore((state) => state.startTime);
export const useEndTime = () => useTimerStore((state) => state.endTime);
export const useTotalTime = () => useTimerStore((state) => state.totalTime);
export const useDisplayTime = () => useTimerStore((state) => state.displayTime);
export const useMode = () => useTimerStore((state) => state.mode);
export const useStatus = () => useTimerStore((state) => state.status);
export const useTimerActions = () => useTimerStore((state) => state.actions);
