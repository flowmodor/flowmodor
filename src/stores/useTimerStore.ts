import { create } from 'zustand';

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

const useTimerStore = create<TimerState>((set) => ({
  startTime: null,
  endTime: null,
  totalTime: null,
  displayTime: 0,
  mode: 'focus',
  showTime: true,
  isRunning: false,
  startTimer: () =>
    set((state) => ({
      startTime: Date.now(),
      endTime:
        state.mode === 'break'
          ? Math.floor(Date.now() + (state.endTime! - state.startTime!) / 5)
          : state.endTime,
      isRunning: true,
    })),
  stopTimer: () =>
    set((state) => ({
      endTime: Date.now(),
      totalTime:
        state.mode === 'focus' ? (Date.now() - state.startTime!) / 5 : 0,
      mode: state.mode === 'focus' ? 'break' : 'focus',
      isRunning: false,
    })),
  tickTimer: () =>
    set((state) => {
      let time;
      if (state.isRunning) {
        time =
          state.mode === 'focus'
            ? Date.now() - state.startTime!
            : state.endTime! - Date.now();
      } else {
        time =
          state.mode === 'focus' ? 0 : (state.endTime! - state.startTime!) / 5;
      }
      return {
        displayTime: Math.floor(time / 1000),
      };
    }),
  toggleShowTime: () => set((state) => ({ showTime: !state.showTime })),
}));

export default useTimerStore;
