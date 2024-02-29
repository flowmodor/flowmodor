import { TodoistApi } from '@doist/todoist-api-typescript';
import { ChangeEvent } from 'react';
import { toast } from 'react-toastify';
import { create } from 'zustand';
import { Tables } from '@/types/supabase';
import supabase from '@/utils/supabase';
import getClient from '@/utils/todoist';

export type Task = Omit<Tables<'tasks'>, 'user_id' | 'created_at'>;

interface TasksState {
  tasks: Task[];
  focusingTask: Task | null;
  lists: { provider: string; name: string; id: string }[];
  activeList: string;
  addTask: (name: string) => Promise<void>;
  completeTask: (task: Task) => Promise<void>;
  undoCompleteTask: (task: Task) => Promise<void>;
  focusTask: (task: Task) => void;
  fetchTasks: () => Promise<void>;
  subscribeToTasks: () => void;
  onListChange: (e: ChangeEvent<HTMLSelectElement>) => void;
}

const useTasksStore = create<TasksState>((set) => ({
  tasks: [],
  focusingTask: null,
  lists: [
    {
      provider: 'Flowmodor',
      name: 'Default',
      id: 'default',
    },
  ],
  activeList: 'Flowmodor - default',
  focusTask: (task) => set(() => ({ focusingTask: task })),
  fetchTasks: async () => {
    set({ focusingTask: null });
    const [provider, id] = useTasksStore.getState().activeList.split(' - ', 2);

    const { data: integrationsData } = await supabase
      .from('integrations')
      .select('provider, access_token')
      .single();

    if (
      provider === 'Todoist' &&
      integrationsData?.provider === 'todoist' &&
      integrationsData.access_token
    ) {
      const api = new TodoistApi(integrationsData.access_token);
      const tasks = await (id === 'all'
        ? api.getTasks()
        : api.getTasks({ projectId: id }));

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
    const [provider, projectId] = useTasksStore
      .getState()
      .activeList.split(' - ', 2);
    console.log(projectId);
    const todoist = await getClient();
    if (provider === 'Todoist' && todoist) {
      try {
        const { id } = await todoist.addTask({
          content: name,
          ...(projectId !== 'all' && { project_id: projectId }),
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
    const [provider] = useTasksStore.getState().activeList.split(' - ', 2);
    const todoist = await getClient();
    if (provider === 'Todoist' && todoist) {
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
    const [provider] = useTasksStore.getState().activeList.split(' - ', 2);
    const todoist = await getClient();
    if (provider === 'Todoist' && todoist) {
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
  subscribeToTasks: () => {
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
  onListChange: (e) => {
    set({ activeList: e.target.value });
  },
}));

export default useTasksStore;

useTasksStore
  .getState()
  .fetchTasks()
  .then(() => {
    useTasksStore.getState().subscribeToTasks();
  });

getClient().then(async (todoist) => {
  if (!todoist) {
    return;
  }

  const data = await todoist.getProjects();
  const todoistLists = data.map((list) => ({
    provider: 'Todoist',
    name: list.name,
    id: list.id,
  }));
  todoistLists.unshift({
    provider: 'Todoist',
    name: 'All',
    id: 'all',
  });
  useTasksStore.setState({
    lists: [...useTasksStore.getState().lists, ...todoistLists],
  });
});
