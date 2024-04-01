/* eslint-disable @typescript-eslint/naming-convention */
import { create } from 'zustand';
import supabase from '@/utils/supabase';
import useStatsStore from './useStatsStore';
import useTasksStore from './useTasksStore';

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
  stopTimer: () => Promise<void>;
  pauseTimer: () => Promise<void>;
  resumeTimer: () => Promise<void>;
  log: () => Promise<void>;
  tickTimer: (nextStep: () => void) => void;
  toggleShowTime: () => void;
}

async function getBreakRatio() {
  const { data } = await supabase
    .from('settings')
    .select('break_ratio')
    .single();
  return data?.break_ratio || 5;
}

const useTimerStore = create<State & Action>((set) => ({
  startTime: null,
  endTime: null,
  totalTime: 0,
  displayTime: 0,
  mode: 'focus',
  showTime: true,
  status: 'idle',
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
  stopTimer: async () => {
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

    await useTimerStore.getState().log();
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
  pauseTimer: async () => {
    await useTimerStore.getState().log();

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
  log: async () => {
    const start_time = new Date(
      useTimerStore.getState().startTime!,
    ).toISOString();
    const end_time = new Date(Date.now()).toISOString();
    const { mode } = useTimerStore.getState();
    const { focusingTask } = useTasksStore.getState();

    if (!focusingTask) {
      await supabase.from('logs').insert([
        {
          mode,
          start_time,
          end_time,
        },
      ]);
      return;
    }

    const hasId = useTasksStore.getState().activeList === 'Flowmodor - default';
    await supabase.from('logs').insert([
      {
        mode,
        start_time,
        end_time,
        task_id: hasId ? focusingTask.id : null,
        task_name: hasId ? null : focusingTask.name,
      },
    ]);

    await useStatsStore.getState().updateLogs();
  },
  tickTimer: async (nextStep: () => void) => {
    set((state) => {
      if (state.status !== 'running') {
        return {};
      }

      const time =
        state.mode === 'focus'
          ? state.totalTime + Date.now() - state.startTime!
          : state.endTime! - Date.now();

      if (state.mode === 'break' && time <= 0) {
        state.stopTimer();
        nextStep();
        const audio = new Audio('/alarm.mp3');
        audio.play();

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
}));

export default useTimerStore;
