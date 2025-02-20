import { LogsWithTasks } from '@flowmodor/types';
import { SupabaseClient } from '@supabase/supabase-js';
import { create } from 'zustand';

export type Period = 'Day' | 'Week' | 'Month';

interface State {
  startDate: Date;
  endDate: Date;
  period: Period;
  displayTime: string;
  logs: LogsWithTasks[] | null;
}

interface Action {
  updateLogs: () => Promise<void>;
  goNextTime: () => Promise<void>;
  goPreviousTime: () => Promise<void>;
  onPeriodChange: (period: Period) => Promise<void>;
  setDate: (date: Date) => Promise<void>;
  setWeek: (date: Date) => Promise<void>;
}

interface Store extends State {
  actions: Action;
}

const updateLogsWithDates = async (
  supabase: SupabaseClient,
  startDate: Date,
  endDate: Date,
  period: Period,
) => {
  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);
  const end = new Date(endDate);
  end.setHours(23, 59, 59, 999);

  const { data, error } = await supabase
    .from('logs')
    .select('*, tasks(name)')
    .gte('end_time', start.toISOString())
    .lte('start_time', end.toISOString());

  if (error) throw error;

  const displayTime =
    period === 'Week'
      ? `${start.toLocaleDateString(undefined, {
          month: 'short',
          day: 'numeric',
        })} - ${end.toLocaleDateString(undefined, {
          month: 'short',
          day: 'numeric',
        })}`
      : start.toLocaleDateString(undefined, {
          month: 'short',
          day: 'numeric',
        });

  return { start, end, data, displayTime };
};

export const createStore = (supabase: SupabaseClient) =>
  create<Store>((set, get) => ({
    startDate: new Date(),
    endDate: new Date(),
    period: 'Day',
    displayTime: new Date().toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
    }),
    logs: null,
    actions: {
      updateLogs: async () => {
        const { startDate, endDate, period } = get();
        const { start, end, data, displayTime } = await updateLogsWithDates(
          supabase,
          startDate,
          endDate,
          period,
        );

        set({
          startDate: start,
          endDate: end,
          logs: data,
          displayTime,
        });
      },
      goNextTime: async () => {
        const { startDate, period } = get();
        let newStart: Date;
        let newEnd: Date;

        if (period === 'Day') {
          newStart = new Date(startDate);
          newStart.setDate(startDate.getDate() + 1);
          newEnd = new Date(newStart);
        } else if (period === 'Week') {
          newStart = new Date(startDate);
          newStart.setDate(startDate.getDate() + 7);
          newEnd = new Date(newStart);
          newEnd.setDate(newStart.getDate() + 6);
        } else {
          return;
        }

        const { start, end, data, displayTime } = await updateLogsWithDates(
          supabase,
          newStart,
          newEnd,
          period,
        );

        set({
          startDate: start,
          endDate: end,
          logs: data,
          displayTime,
        });
      },
      goPreviousTime: async () => {
        const { startDate, period } = get();
        let newStart: Date;
        let newEnd: Date;

        if (period === 'Day') {
          newStart = new Date(startDate);
          newStart.setDate(startDate.getDate() - 1);
          newEnd = new Date(newStart);
        } else if (period === 'Week') {
          newStart = new Date(startDate);
          newStart.setDate(startDate.getDate() - 7);
          newEnd = new Date(newStart);
          newEnd.setDate(newStart.getDate() + 6);
        } else {
          return;
        }

        const { start, end, data, displayTime } = await updateLogsWithDates(
          supabase,
          newStart,
          newEnd,
          period,
        );

        set({
          startDate: start,
          endDate: end,
          logs: data,
          displayTime,
        });
      },
      onPeriodChange: async (period: Period) => {
        const { startDate } = get();
        let newStart: Date = new Date(startDate);
        let newEnd: Date;

        if (period === 'Week') {
          const day = startDate.getDay();
          newStart.setDate(startDate.getDate() - day);
          newEnd = new Date(newStart);
          newEnd.setDate(newStart.getDate() + 6);
        } else {
          newEnd = new Date(newStart);
        }

        const { start, end, data, displayTime } = await updateLogsWithDates(
          supabase,
          newStart,
          newEnd,
          period,
        );

        set({
          period,
          startDate: start,
          endDate: end,
          logs: data,
          displayTime,
        });
      },
      setDate: async (date: Date) => {
        const { period } = get();
        const { start, end, data, displayTime } = await updateLogsWithDates(
          supabase,
          date,
          date,
          period,
        );

        set({
          startDate: start,
          endDate: end,
          logs: data,
          displayTime,
        });
      },
      setWeek: async (date: Date) => {
        const { period } = get();
        const startDate = new Date(date);
        startDate.setDate(date.getDate() - date.getDay());
        startDate.setHours(0, 0, 0, 0);

        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 6);
        endDate.setHours(23, 59, 59, 999);

        const { start, end, data, displayTime } = await updateLogsWithDates(
          supabase,
          startDate,
          endDate,
          period,
        );

        set({
          startDate: start,
          endDate: end,
          logs: data,
          displayTime,
        });
      },
    },
  }));

export const createHooks = (useStore: ReturnType<typeof createStore>) => ({
  usePeriod: () => useStore((state) => state.period),
  useStartDate: () => useStore((state) => state.startDate.toDateString()),
  useEndDate: () => useStore((state) => state.endDate.toDateString()),
  useDisplayTime: () => useStore((state) => state.displayTime),
  useLogs: () => useStore((state) => state.logs),
  useStatsActions: () => useStore((state) => state.actions),
  useIsDisabled: () => {
    const period = useStore((state) => state.period);
    const startDate = useStore((state) => state.startDate);
    const endDate = useStore((state) => state.endDate);

    const today = new Date();

    if (period === 'Day') {
      return today.getDate() === endDate.getDate();
    }

    if (period === 'Week') {
      return today >= startDate && today <= endDate;
    }

    return false;
  },
});
