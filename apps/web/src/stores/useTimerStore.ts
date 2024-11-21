/* eslint-disable @typescript-eslint/naming-convention */
import { Task } from '@flowmodor/types';
import { useEffect, useState } from 'react';
import { create } from 'zustand';
import supabase from '@/utils/supabase/client';
import { Source } from './sources';
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
  stopTimer: (
    focusingTask?: Task | null,
    activeSource?: Source,
  ) => Promise<void>;
  pauseTimer: (
    focusingTask: Task | null,
    activeSource: Source,
  ) => Promise<void>;
  resumeTimer: () => Promise<void>;
  log: (focusingTask?: Task | null, activeSource?: Source) => Promise<void>;
  tickTimer: (callback: () => void) => void;
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

const useTimerStore = create<Store>((set, get) => ({
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
    stopTimer: async (focusingTask, activeSource) => {
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

      await get().actions.log(focusingTask, activeSource);
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
    pauseTimer: async (focusingTask, activeSource) => {
      await get().actions.log(focusingTask, activeSource);

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
    log: async (focusingTask, activeSource) => {
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
        return;
      }

      const hasId = activeSource === Source.Flowmodor;
      await supabase.from('logs').insert([
        {
          start_time,
          end_time,
          task_id: hasId ? parseInt(focusingTask.id, 10) : null,
          task_name: hasId ? null : focusingTask.name,
        },
      ]);

      await useStatsStore.getState().actions.updateLogs();
    },
    tickTimer: async (callback) => {
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
          callback();

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
