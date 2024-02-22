import { TodoistApi } from '@doist/todoist-api-typescript';
import { toast } from 'react-toastify';
import { create } from 'zustand';
import { Tables } from '@/types/supabase';
import supabase from '@/utils/supabase';

interface TasksState {
  tasks: Tables<'tasks'>[];
  focusingTask: number | null;
  completeTask: (task: Tables<'tasks'>) => Promise<void>;
  undoCompleteTask: (task: Tables<'tasks'>) => Promise<void>;
  focusTask: (key: number) => void;
  fetchTasks: () => Promise<void>;
  subscribeToTasks: () => void;
}

const useTasksStore = create<TasksState>((set) => ({
  tasks: [],
  focusingTask: null,
  focusTask: (key) => set(() => ({ focusingTask: key })),
  fetchTasks: async () => {
    const { data: integrationsData } = await supabase
      .from('integrations')
      .select('provider, access_token')
      .single();

    if (
      integrationsData?.provider === 'todoist' &&
      integrationsData.access_token
    ) {
      const api = new TodoistApi(integrationsData.access_token);
      const tasks = await api.getTasks();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      const processedTasks = tasks.map((task) => ({
        id: parseInt(task.id, 10),
        name: task.content,
        completed: task.isCompleted,
        created_at: task.createdAt,
        user_id: user?.id ?? null,
      }));
      set({ tasks: processedTasks });
    } else {
      const { data } = await supabase
        .from('tasks')
        .select('*')
        .is('completed', false);
      set({ tasks: data! });
    }
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
