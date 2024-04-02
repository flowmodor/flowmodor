import { create } from 'zustand';
import { LogsWithTasks } from '@/utils/stats/calculateTaskTime';
import supabase from '@/utils/supabase';

interface State {
  date: Date;
  logs: LogsWithTasks[] | null;
}

interface Action {
  updateLogs: () => Promise<void>;
  goNextDay: () => void;
  goPreviousDay: () => void;
}

interface Store extends State {
  actions: Action;
}

export const useStatsStore = create<Store>((set) => ({
  date: new Date(),
  logs: null,
  actions: {
    updateLogs: async () => {
      const { date } = useStatsStore.getState();
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);

      const { data, error } = await supabase
        .from('logs')
        .select('*, tasks(name)')
        .gte('start_time', startDate.toISOString())
        .lte('start_time', endDate.toISOString());

      if (!error) {
        set({ logs: data });
      }
    },
    goNextDay: () => {
      set((state) => {
        const tomorrow = new Date(state.date);
        tomorrow.setDate(state.date.getDate() + 1);
        return {
          date: tomorrow,
        };
      });
      useStatsStore.getState().actions.updateLogs();
    },
    goPreviousDay: () => {
      set((state) => {
        const yesterday = new Date(state.date);
        yesterday.setDate(state.date.getDate() - 1);
        return {
          date: yesterday,
        };
      });
      useStatsStore.getState().actions.updateLogs();
    },
  },
}));

export const useDate = () => useStatsStore((state) => state.date);
export const useLogs = () => useStatsStore((state) => state.logs);
export const useStatsActions = () => useStatsStore((state) => state.actions);

useStatsStore.getState().actions.updateLogs();
