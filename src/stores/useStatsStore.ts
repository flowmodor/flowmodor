import { create } from 'zustand';
import { LogsWithTasks } from '@/utils/stats/calculateTaskTime';
import supabase from '@/utils/supabase';

interface State {
  startDate: Date;
  endDate: Date;
  period: 'day' | 'week' | 'month';
  displayTime: string;
  logs: LogsWithTasks[] | null;
}

interface Action {
  updateLogs: () => Promise<void>;
  goNextTime: () => void;
  goPreviousTime: () => void;
}

interface Store extends State {
  actions: Action;
}

export const useStatsStore = create<Store>((set) => ({
  startDate: new Date(),
  endDate: new Date(),
  period: 'day',
  displayTime: new Date().toDateString(),
  logs: null,
  actions: {
    updateLogs: async () => {
      const { startDate: sd, endDate: ed, period } = useStatsStore.getState();

      if (period === 'day') {
        const startDate = new Date(sd);
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date(ed);
        endDate.setHours(23, 59, 59, 999);

        const { data, error } = await supabase
          .from('logs')
          .select('*, tasks(name)')
          .gte('start_time', startDate.toISOString())
          .lte('start_time', endDate.toISOString());

        if (!error) {
          set({
            logs: data,
            displayTime: startDate.toDateString(),
          });
        }
      }
    },
    goNextTime: () => {
      set((state) => {
        if (state.period === 'day') {
          const tomorrow = new Date(state.startDate);
          tomorrow.setDate(state.startDate.getDate() + 1);
          return {
            startDate: tomorrow,
            endDate: tomorrow,
          };
        }

        return {};
      });
      useStatsStore.getState().actions.updateLogs();
    },
    goPreviousTime: () => {
      set((state) => {
        if (state.period === 'day') {
          const yesterday = new Date(state.startDate);
          yesterday.setDate(state.startDate.getDate() - 1);
          return {
            startDate: yesterday,
            endDate: yesterday,
          };
        }

        return {};
      });
      useStatsStore.getState().actions.updateLogs();
    },
  },
}));

export const useStartDate = () => useStatsStore((state) => state.startDate);
export const useEndDate = () => useStatsStore((state) => state.endDate);
export const useDisplayTime = () => useStatsStore((state) => state.displayTime);
export const useLogs = () => useStatsStore((state) => state.logs);
export const useStatsActions = () => useStatsStore((state) => state.actions);

useStatsStore.getState().actions.updateLogs();
