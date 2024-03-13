/* eslint-disable @typescript-eslint/naming-convention */
import mixpanel from 'mixpanel-browser';
import { create } from 'zustand';
import supabase from '@/utils/supabase';
import useStatsStore from './useStatsStore';
import useTasksStore from './useTasksStore';

interface TimerState {
  startTime: number | null;
  endTime: number | null;
  totalTime: number | null;
  displayTime: number;
  mode: 'focus' | 'break';
  showTime: boolean;
  isRunning: boolean;
  stopped: boolean;
  startTimer: () => Promise<void>;
  stopTimer: () => Promise<void>;
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

const useTimerStore = create<TimerState>((set) => ({
  startTime: null,
  endTime: null,
  totalTime: null,
  displayTime: 0,
  mode: 'focus',
  showTime: true,
  isRunning: false,
  stopped: true,
  startTimer: async () => {
    const breakRatio = await getBreakRatio();
    set((state) => ({
      startTime: Date.now(),
      endTime:
        state.mode === 'break'
          ? Math.floor(
              Date.now() + (state.endTime! - state.startTime!) / breakRatio,
            )
          : state.endTime,
      isRunning: true,
    }));
  },
  stopTimer: async () => {
    const focusTime = Date.now() - useTimerStore.getState().startTime!;
    const { mode } = useTimerStore.getState();
    if (mode === 'focus' && focusTime / 1000 >= 10) {
      mixpanel.track('Focus', { duration: focusTime / 1000 });
    }

    const breakRatio = await getBreakRatio();

    set((state) => {
      const totalTime =
        state.mode === 'focus'
          ? (Date.now() - state.startTime!) / breakRatio
          : 0;
      return {
        endTime: Date.now(),
        totalTime,
        displayTime: Math.floor(totalTime / 1000),
        mode: state.mode === 'focus' ? 'break' : 'focus',
        isRunning: false,
      };
    });

    await useStatsStore.getState().updateLogs();
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
  },
  tickTimer: async (nextStep: () => void) => {
    let breakRatio: number;
    const { isRunning } = useTimerStore.getState();
    if (!isRunning) {
      breakRatio = await getBreakRatio();
    }

    set((state) => {
      let time;
      if (state.isRunning) {
        time =
          state.mode === 'focus'
            ? Date.now() - state.startTime!
            : state.endTime! - Date.now();
      } else {
        time =
          state.mode === 'focus'
            ? 0
            : (state.endTime! - state.startTime!) / breakRatio;
      }

      if (state.mode === 'break' && time <= 0) {
        state.log();
        state.stopTimer();
        nextStep();
        const audio = new Audio('/alarm.mp3');
        audio.play();

        return {
          isRunning: false,
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
