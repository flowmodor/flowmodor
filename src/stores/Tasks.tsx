'use client';

import { TodoistApi } from '@doist/todoist-api-typescript';
import {
  ChangeEvent,
  PropsWithChildren,
  createContext,
  useContext,
  useRef,
} from 'react';
import { toast } from 'sonner';
import { createStore, useStore } from 'zustand';
import supabase from '@/utils/supabase';
import getClient from '@/utils/todoist';

export interface Task {
  id: number;
  name: string;
  completed: boolean;
  labels?: string[];
  due?: Date | null;
}

interface List {
  provider: string;
  name: string;
  id: string;
}

interface Props {
  tasks: Task[];
  lists: List[];
  labels: string[];
}

interface State extends Props {
  focusingTask: Task | null;
  isLoadingTasks: boolean;
  activeList: string;
  isLoadingLists: boolean;
  activeLabel: string;
  labels: string[];
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
  onLabelChange: (e: ChangeEvent<HTMLSelectElement>) => void;
}

interface Store extends State {
  actions: Action;
}

type TasksStore = ReturnType<typeof createTasksStore>;

export const defaultActiveList = 'Flowmodor - default';

const createTasksStore = (initProps: Props) =>
  createStore<Store>()((set, get) => ({
    ...initProps,
    focusingTask: null,
    isLoadingTasks: false,
    activeList: defaultActiveList,
    isLoadingLists: false,
    activeLabel: '',
    actions: {
      addTask: async (name) => {
        const { tasks, activeList, activeLabel: label } = get();
        const [provider, projectId] = activeList.split(' - ', 2);

        const todoist = await getClient(supabase);
        if (provider === 'Todoist' && todoist) {
          try {
            const { id } = await todoist.addTask({
              content: name,
              ...(projectId !== 'all' &&
                projectId !== 'today' && { project_id: projectId }),
              ...(projectId === 'today' && { due_string: 'today' }),
              ...(label && { labels: [label] }),
            });
            set({
              tasks: [
                ...tasks,
                {
                  id: parseInt(id, 10),
                  name,
                  completed: false,
                  ...(label && { labels: [label] }),
                },
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
        const { activeList, focusingTask, actions } = get();
        const [provider] = activeList.split(' - ', 2);

        if (focusingTask?.id === task.id) {
          actions.unfocusTask();
        }

        const todoist = await getClient(supabase);
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

        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== task.id),
        }));
      },
      undoCompleteTask: async (task) => {
        const { activeList } = get();
        const [provider] = activeList.split(' - ', 2);
        const todoist = await getClient(supabase);
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
              due: task.due,
            },
            ...state.tasks,
          ],
        }));
      },
      updateLists: async () => {
        const { actions } = get();
        const todoist = await getClient(supabase);
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
          actions.fetchTasks();
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
        actions.fetchTasks();
      },
      focusTask: (task) => set({ focusingTask: task }),
      unfocusTask: () => set({ focusingTask: null }),
      fetchTasks: async () => {
        set({ focusingTask: null, isLoadingTasks: true });

        const { activeList } = get();
        const [provider, id] = activeList.split(' - ');

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

          const listName = get().lists.find((list) => list.id === id)?.name;

          let filter = '';
          if (id === 'all') {
            filter = 'all';
          } else if (id === 'today') {
            filter = 'today';
          } else if (listName) {
            filter = `#${listName}`;
          }

          const tasks = await api.getTasks({ filter });

          const processedTasks = tasks.map((task) => ({
            id: parseInt(task.id, 10),
            name: task.content,
            completed: task.isCompleted,
            labels: task.labels,
            due: task.due?.date ? new Date(task.due.date) : null,
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
      onListChange: (e) => {
        if (e.target.value === '') {
          return false;
        }

        set({ activeList: e.target.value });
        return true;
      },
      onLabelChange: (e) => {
        set({ activeLabel: e.target.value });
      },
    },
  }));

const TasksContext = createContext<TasksStore | null>(null);

type TasksProviderProps = PropsWithChildren<Props>;

export function TasksProvider({ children, ...props }: TasksProviderProps) {
  const storeRef = useRef<TasksStore>();
  if (!storeRef.current) {
    storeRef.current = createTasksStore(props);
  }
  return (
    <TasksContext.Provider value={storeRef.current}>
      {children}
    </TasksContext.Provider>
  );
}

function useTasksContext<T>(selector: (state: Store) => T): T {
  const store = useContext(TasksContext);
  if (!store) throw new Error('Missing TasksContext.Provider in the tree');
  return useStore(store, selector);
}

export const useLists = () => useTasksContext((s) => s.lists);
export const useFocusingTask = () => useTasksContext((s) => s.focusingTask);
export const useIsLoadingTasks = () => useTasksContext((s) => s.isLoadingTasks);
export const useActiveList = () => useTasksContext((s) => s.activeList);
export const useIsLoadingLists = () => useTasksContext((s) => s.isLoadingLists);
export const useLabels = () => useTasksContext((s) => s.labels);
export const useActiveLabel = () => useTasksContext((s) => s.activeLabel);
export const useTasksActions = () => useTasksContext((s) => s.actions);
export const useTasks = () => {
  const tasks = useTasksContext((state) => state.tasks);
  const activeLabel = useActiveLabel();
  const activeList = useActiveList();

  if (activeLabel === '' || activeList === defaultActiveList) {
    return tasks;
  }

  return tasks.filter((task) => task.labels?.includes(activeLabel));
};
