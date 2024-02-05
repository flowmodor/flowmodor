import { create } from 'zustand';
import { toast } from 'react-toastify';
import supabase from '@/utils/supabase';

interface TasksState {
  tasks: any[];
  focusingTask: number | null;
  completeTask: (task: any) => Promise<void>;
  undoCompleteTask: (task: any) => Promise<void>;
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
  completeTask: async (task) => {
    await supabase.from('tasks').update({ completed: true }).eq('id', task.id);
  },
  undoCompleteTask: async (task) => {
    await supabase.from('tasks').update({ completed: false }).eq('id', task.id);
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
        } else {
          set((state) => ({
            tasks: [payload.new, ...state.tasks],
          }));
          if (toast.isActive(payload.new.id)) {
            toast.dismiss(payload.new.id);
          }
        }
      },
    );

    tasksChannel.subscribe();
  },
}));

export default useTasksStore;
