import { create } from 'zustand';

interface TimerState {
  startTime: number | null;
  endTime: number | null;
  totalTime: number | null;
  mode: 'focus' | 'break';
  showTime: boolean;
  isRunning: boolean;
  startTimer: () => void;
  stopTimer: () => void;
  toggleShowTime: () => void;
}

const useTimerStore = create<TimerState>((set) => ({
  startTime: null,
  endTime: null,
  totalTime: null,
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
  toggleShowTime: () => set((state) => ({ showTime: !state.showTime })),
}));

// eslint-disable-next-line import/prefer-default-export
export default useTimerStore;
