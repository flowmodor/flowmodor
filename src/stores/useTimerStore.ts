import mixpanel from 'mixpanel-browser';
import { create } from 'zustand';
import supabase from '@/utils/supabase';

interface TimerState {
  startTime: number | null;
  endTime: number | null;
  totalTime: number | null;
  displayTime: number;
  mode: 'focus' | 'break';
  showTime: boolean;
  isRunning: boolean;
  startTimer: () => void;
  stopTimer: () => void;
  tickTimer: () => void;
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
    if (focusTime / 1000 >= 60 * 1) {
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
  },
  tickTimer: async () => {
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
      return {
        displayTime: Math.floor(time / 1000),
      };
    });
  },
  toggleShowTime: () => set((state) => ({ showTime: !state.showTime })),
}));

export default useTimerStore;
