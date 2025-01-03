import { Source } from '@flowmodor/task-sources';
import { Task } from '@flowmodor/types';
import { SupabaseClient } from '@supabase/supabase-js';
import { create } from 'zustand';
import { createStore as createStatsStore } from './stats';

type OnBreakStart = (totalTime: number) => Promise<void>;

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
  start: (callback?: () => Promise<void>) => Promise<void>;
  stop: (focusingTask?: Task | null, activeSource?: Source) => Promise<void>;
  pause: (focusingTask: Task | null, activeSource: Source) => Promise<void>;
  resume: () => Promise<void>;
  log: (focusingTask?: Task | null, activeSource?: Source) => Promise<void>;
  tick: (callback?: () => void) => void;
  toggleShowTime: () => void;
}

interface Store extends State {
  actions: Action;
}

async function getBreakRatio(supabase: SupabaseClient) {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return 5;
  }

  const { data } = await supabase
    .from('settings')
    .select('break_ratio')
    .single();
  return data?.break_ratio || 5;
}

export const createStore = (
  supabase: SupabaseClient,
  statsStore: ReturnType<typeof createStatsStore>,
  onBreakStart?: OnBreakStart,
) =>
  create<Store>((set, get) => ({
    startTime: null,
    endTime: null,
    totalTime: 0,
    displayTime: 0,
    mode: 'focus',
    showTime: true,
    status: 'idle',
    actions: {
      start: async () => {
        const { mode, totalTime } = get();

        if (mode === 'break' && onBreakStart) {
          await onBreakStart(totalTime);
        }

        set((state) => ({
          startTime: Date.now(),
          endTime:
            state.mode === 'break'
              ? Date.now() + state.totalTime
              : state.endTime,
          status: 'running',
        }));
      },
      stop: async (focusingTask, activeSource) => {
        const breakRatio = await getBreakRatio(supabase);

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
      pause: async (focusingTask, activeSource) => {
        await get().actions.log(focusingTask, activeSource);

        set((state) => {
          const totalTime = state.totalTime + Date.now() - state.startTime!;
          return {
            status: 'paused',
            totalTime,
          };
        });
      },
      resume: async () => {
        set(() => ({
          status: 'running',
          startTime: Date.now(),
        }));
      },
      log: async (focusingTask, activeSource) => {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          return;
        }

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
          await statsStore.getState().actions.updateLogs();
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
        await statsStore.getState().actions.updateLogs();
      },
      tick: (callback) => {
        set((state) => {
          if (state.status !== 'running') {
            return {};
          }

          const time =
            state.mode === 'focus'
              ? state.totalTime + Date.now() - state.startTime!
              : state.endTime! - Date.now();

          if (state.mode === 'break' && time <= 0) {
            state.actions.stop();
            if (callback) callback();

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

export const createHooks = (useStore: ReturnType<typeof createStore>) => ({
  useStartTime: () => useStore((state) => state.startTime),
  useEndTime: () => useStore((state) => state.endTime),
  useTotalTime: () => useStore((state) => state.totalTime),
  useDisplayTime: () => useStore((state) => state.displayTime),
  useMode: () => useStore((state) => state.mode),
  useShowTime: () =>
    useStore((state) => state.showTime || state.status === 'idle'),
  useStatus: () => useStore((state) => state.status),
  useActions: () => useStore((state) => state.actions),
});