import { TodoistApi } from '@doist/todoist-api-typescript';
import { ChangeEvent } from 'react';
import { toast } from 'sonner';
import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';
import supabase from '@/utils/supabase';
import getClient from '@/utils/todoist';

export interface Task {
  id: number;
  name: string;
  completed: boolean;
  labels?: string[];
}

interface State {
  tasks: Task[];
  focusingTask: Task | null;
  isLoadingTasks: boolean;
  lists: { provider: string; name: string; id: string }[];
  activeList: string;
  isLoadingLists: boolean;
}

interface Action {
  addTask: (name: string) => Promise<void>;
  completeTask: (task: Task) => Promise<void>;
  undoCompleteTask: (task: Task) => Promise<void>;
  updateLists: () => Promise<void>;
  focusTask: (task: Task) => void;
  unfocusTask: () => void;
  fetchTasks: () => Promise<void>;
  onListChange: (e: ChangeEvent<HTMLSelectElement>) => boolean;
}

interface Store extends State {
  actions: Action;
}

const defaultActiveList = 'Flowmodor - default';

export const useTasksStore = create<Store>((set) => ({
  tasks: [],
  focusingTask: null,
  isLoadingTasks: true,
  lists: [
    {
      provider: 'Flowmodor',
      name: 'Default',
      id: 'default',
    },
  ],
  activeList: defaultActiveList,
  isLoadingLists: true,
  actions: {
    focusTask: (task) => set(() => ({ focusingTask: task })),
    unfocusTask: () => set(() => ({ focusingTask: null })),
    fetchTasks: async () => {
      set({ focusingTask: null, isLoadingTasks: true });
      const [provider, id] = useTasksStore
        .getState()
        .activeList.split(' - ', 2);

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
        const tasks = await api.getTasks({
          ...(id === 'all' && { filter: 'all' }),
          ...(id === 'today' && { filter: 'today' }),
          ...(id !== 'all' && id !== 'today' && { projectId: id }),
        });

        const processedTasks = tasks.map((task) => ({
          id: parseInt(task.id, 10),
          name: task.content,
          completed: task.isCompleted,
          labels: task.labels,
        }));
        set({ tasks: processedTasks, isLoadingTasks: false });
      } else {
        const { data } = await supabase
          .from('tasks')
          .select('*')
          .is('completed', false);
        set({ tasks: data!, isLoadingTasks: false });
      }
    },
    addTask: async (name) => {
      const [provider, projectId] = useTasksStore
        .getState()
        .activeList.split(' - ', 2);

      const todoist = await getClient();
      if (provider === 'Todoist' && todoist) {
        try {
          const { id } = await todoist.addTask({
            content: name,
            ...(projectId !== 'all' &&
              projectId !== 'today' && { project_id: projectId }),
            ...(projectId === 'today' && { due_string: 'today' }),
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
        const { data, error } = await supabase
          .from('tasks')
          .insert([{ name }])
          .select();

        if (error) {
          toast.error(error.message);
          return;
        }

        set((state) => ({
          tasks: [...state.tasks, data[0]],
        }));
      }
    },
    completeTask: async (task) => {
      const [provider] = useTasksStore.getState().activeList.split(' - ', 2);

      if (useTasksStore.getState().focusingTask?.id === task.id) {
        useTasksStore.getState().actions.unfocusTask();
      }

      const todoist = await getClient();
      if (provider === 'Todoist' && todoist) {
        const isSuccess = await todoist.closeTask(task.id.toString());
        if (!isSuccess) {
          toast.error('Failed to complete task');
          return;
        }
      } else {
        const { error } = await supabase
          .from('tasks')
          .update({ completed: true })
          .eq('id', task.id)
          .select();

        if (error) {
          toast.error(error.message);
          return;
        }
      }

      set((state) => ({ tasks: state.tasks.filter((t) => t.id !== task.id) }));
    },
    undoCompleteTask: async (task) => {
      const [provider] = useTasksStore.getState().activeList.split(' - ', 2);
      const todoist = await getClient();
      if (provider === 'Todoist' && todoist) {
        const isSuccess = await todoist.reopenTask(task.id.toString());
        if (!isSuccess) {
          toast.error('Failed to undo complete task');
          return;
        }
      } else {
        const { error } = await supabase
          .from('tasks')
          .update({ completed: false })
          .eq('id', task.id)
          .select();

        if (error) {
          toast.error(error.message);
          return;
        }
      }

      set((state) => ({
        tasks: [
          {
            id: task.id,
            name: task.name,
            completed: false,
            labels: task.labels,
          },
          ...state.tasks,
        ],
      }));
    },
    updateLists: async () => {
      const todoist = await getClient();
      if (todoist) {
        const data = await todoist.getProjects();
        const todoistLists = data.map((list) => ({
          provider: 'Todoist',
          name: list.name,
          id: list.id,
        }));

        set((state) => ({
          lists: [
            ...state.lists,
            { provider: 'Todoist', name: 'All', id: 'all' },
            { provider: 'Todoist', name: 'Today', id: 'today' },
            ...todoistLists,
          ],
          activeList: defaultActiveList,
          isLoadingLists: false,
        }));
        useTasksStore.getState().actions.fetchTasks();
        return;
      }

      set((state) => {
        const newLists = state.lists.filter(
          (list) => list.provider !== 'Todoist',
        );
        return {
          lists: newLists,
          activeList: defaultActiveList,
          isLoadingLists: false,
        };
      });
      useTasksStore.getState().actions.fetchTasks();
    },
    onListChange: (e) => {
      if (e.target.value === '') {
        return false;
      }

      set({ activeList: e.target.value });
      return true;
    },
  },
}));

export const useTasks = () => useTasksStore(useShallow((state) => state.tasks));
export const useFocusingTask = () =>
  useTasksStore(useShallow((state) => state.focusingTask));
export const useIsLoadingTasks = () =>
  useTasksStore((state) => state.isLoadingTasks);
export const useLists = () => useTasksStore(useShallow((state) => state.lists));
export const useActiveList = () => useTasksStore((state) => state.activeList);
export const useIsLoadingLists = () =>
  useTasksStore((state) => state.isLoadingLists);
export const useTasksActions = () => useTasksStore((state) => state.actions);

useTasksStore.getState().actions.updateLists();
