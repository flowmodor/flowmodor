/* eslint-disable @typescript-eslint/naming-convention */
import { useEffect, useState } from 'react';
import { create } from 'zustand';
import supabase from '@/utils/supabase';
import { Task } from './Tasks';
import { useStatsStore } from './useStatsStore';

interface State {
  startTime: number | null;
  endTime: number | null;
  totalTime: number;
  displayTime: number;
  mode: 'focus' | 'break';
  showTime: boolean;
  status: 'idle' | 'running' | 'paused';
}

interface Action {
  startTimer: () => Promise<void>;
  stopTimer: (focusingTask?: Task | null, activeList?: string) => Promise<void>;
  pauseTimer: (focusingTask: Task | null, activeList: string) => Promise<void>;
  resumeTimer: () => Promise<void>;
  log: (focusingTask?: Task | null, activeList?: string) => Promise<void>;
  tickTimer: () => void;
  toggleShowTime: () => void;
}

interface Store extends State {
  actions: Action;
}

async function getBreakRatio() {
  const { data } = await supabase
    .from('settings')
    .select('break_ratio')
    .single();
  return data?.break_ratio || 5;
}

const useTimerStore = create<Store>((set) => ({
  startTime: null,
  endTime: null,
  totalTime: 0,
  displayTime: 0,
  mode: 'focus',
  showTime: true,
  status: 'idle',
  actions: {
    startTimer: async () => {
      set((state) => ({
        startTime: Date.now(),
        endTime:
          state.mode === 'break'
            ? Math.floor(Date.now() + state.totalTime)
            : state.endTime,
        status: 'running',
      }));
    },
    stopTimer: async (focusingTask, activeList) => {
      const breakRatio = await getBreakRatio();

      if (useTimerStore.getState().status === 'paused') {
        const totalTime = useTimerStore.getState().totalTime / breakRatio;
        set((state) => ({
          totalTime,
          displayTime: Math.floor(totalTime / 1000),
          mode: state.mode === 'focus' ? 'break' : 'focus',
          status: 'idle',
        }));
        return;
      }

      await useTimerStore.getState().actions.log(focusingTask, activeList);
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
      await useTimerStore.getState().actions.log(focusingTask, activeList);

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
      const start_time = new Date(
        useTimerStore.getState().startTime!,
      ).toISOString();
      const end_time = new Date(Date.now()).toISOString();
      const { mode } = useTimerStore.getState();

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
          const audio = new Audio('/alarm.mp3');
          audio.play();

          // eslint-disable-next-line no-new
          new Notification('Flowmodor', {
            body: 'Time to focus!',
            icon: '/images/icons/general_icon_x512.png',
          });

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
    toggleShowTime: () => set((state) => ({ showTime: !state.showTime })),
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
export const useShowTime = () =>
  useTimerStore((state) => state.showTime || state.status === 'idle');
export const useStatus = () => useTimerStore((state) => state.status);
export const useTimerActions = () => useTimerStore((state) => state.actions);
