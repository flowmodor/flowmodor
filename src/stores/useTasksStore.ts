import { TodoistApi } from '@doist/todoist-api-typescript';
import { toast } from 'react-toastify';
import { create } from 'zustand';
import { Tables } from '@/types/supabase';
import supabase from '@/utils/supabase';
import getClient from '@/utils/todoist';

interface TasksState {
  tasks: Omit<Tables<'tasks'>, 'user_id' | 'created_at'>[];
  focusingTask: number | null;
  addTask: (name: string) => Promise<void>;
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

      const processedTasks = tasks.map((task) => ({
        id: parseInt(task.id, 10),
        name: task.content,
        completed: task.isCompleted,
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
  addTask: async (name) => {
    const todoist = await getClient();
    if (todoist) {
      try {
        const { id } = await todoist.addTask({
          content: name,
        });
        set({
          tasks: [
            ...useTasksStore.getState().tasks,
            { id: parseInt(id, 10), name, completed: false },
          ],
        });
      } catch (error) {
        console.error(error);
      }
    } else {
      const { error } = await supabase.from('tasks').insert([{ name }]);

      if (error) {
        toast(error.message);
      }
    }
  },
  completeTask: async (task) => {
    const todoist = await getClient();
    if (todoist) {
      try {
        const isSuccess = await todoist.closeTask(task.id.toString());
        if (!isSuccess) {
          throw new Error('Failed to complete task');
        }

        const newTasks = useTasksStore
          .getState()
          .tasks.filter((t) => t.id !== task.id);
        set({ tasks: newTasks });
      } catch (error) {
        console.error(error);
      }
    } else {
      await supabase
        .from('tasks')
        .update({ completed: true })
        .eq('id', task.id);
    }
  },
  undoCompleteTask: async (task) => {
    const todoist = await getClient();
    if (todoist) {
      try {
        const isSuccess = await todoist.reopenTask(task.id.toString());
        if (!isSuccess) {
          throw new Error('Failed to reopen task');
        }

        set({
          tasks: [
            {
              id: parseInt(task.id.toString(), 10),
              name: task.name,
              completed: false,
            },
            ...useTasksStore.getState().tasks,
          ],
        });
        toast.dismiss(task.id);
      } catch (error) {
        console.error(error);
      }
    } else {
      await supabase
        .from('tasks')
        .update({ completed: false })
        .eq('id', task.id);
      toast.dismiss(task.id);
    }
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
        }
      },
    );

    tasksChannel.subscribe();
  },
}));

export default useTasksStore;
