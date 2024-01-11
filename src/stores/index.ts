import { create } from 'zustand';

interface TimerState {
  time: number;
  totalTime: number;
  mode: 'focus' | 'break';
  showTime: boolean;
  isRunning: boolean;
  countUp: () => void;
  countDown: () => void;
  startFocus: () => void;
  startBreak: () => void;
  reset: () => void;
  toggleShowTime: () => void;
  toggleTimer: () => void;
}

const useTimerStore = create<TimerState>((set) => ({
  time: 0,
  totalTime: 0,
  mode: 'focus',
  showTime: true,
  isRunning: false,
  countUp: () => set((state) => ({ time: state.time + 1 })),
  countDown: () => set((state) => ({ time: state.time - 1 })),
  startFocus: () =>
    set(() => ({
      mode: 'focus',
      isRunning: false,
      time: 0,
    })),
  startBreak: () =>
    set((state) => ({
      mode: 'break',
      time: Math.floor(state.time / 5),
      totalTime: Math.floor(state.time / 5),
    })),
  reset: () => set({ time: 0 }),
  toggleShowTime: () => set((state) => ({ showTime: !state.showTime })),
  toggleTimer: () => set((state) => ({ isRunning: !state.isRunning })),
}));

// eslint-disable-next-line import/prefer-default-export
export { useTimerStore };
