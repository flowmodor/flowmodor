import supabase from '@/utils/supabase';
import { create } from 'zustand';

interface TasksState {
  tasks: any[];
  focusingTask: number | null;
  focusTask: (key: number) => void;
  fetchTasks: () => Promise<void>;
  subscribeToTasks: () => void;
}

const useTasksStore = create<TasksState>((set) => ({
  tasks: [],
  focusingTask: null,
  focusTask: (key) => set(() => ({ focusingTask: key })),
  fetchTasks: async () => {
    const { data } = await supabase
      .from('tasks')
      .select('*')
      .is('completed', false);
    set({ tasks: data! });
  },
  subscribeToTasks: async () => {
    const tasksChannel = supabase.channel('tasks');
    tasksChannel.on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public' },
      (payload: any) => {
        set((state) => ({ tasks: [...state.tasks, payload.new] }));
      },
    );

    tasksChannel.on(
      'postgres_changes',
      { event: 'UPDATE', schema: 'public' },
      (payload: any) => {
        if (payload.new.completed) {
          set((state) => ({
            tasks: state.tasks.filter((task) => task.id !== payload.new.id),
            focusingTask:
              payload.old.id === state.focusingTask ? null : state.focusingTask,
          }));
        }
      },
    );

    tasksChannel.subscribe();
  },
}));

export default useTasksStore;
