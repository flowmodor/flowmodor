'use client';

import { Task } from '@flowmodor/types';
import { ChangeEvent } from 'react';
import { toast } from 'sonner';
import { create } from 'zustand';
import supabase from '@/utils/supabase';
import getClient from '@/utils/todoist';

export const defaultActiveList = 'Flowmodor - default';

interface List {
  provider: string;
  name: string;
  id: string;
}

interface State {
  tasks: Task[];
  focusingTask: Task | null;
  isLoadingTasks: boolean;
  activeList: string;
  lists: List[];
  isLoadingLists: boolean;
  activeLabel: string;
  labels: string[];
}

interface Action {
  addTask: (name: string) => Promise<void>;
  deleteTask: (task: Task) => Promise<void>;
  completeTask: (task: Task) => Promise<void>;
  undoCompleteTask: (task: Task) => Promise<void>;
  fetchListsAndLabels: () => Promise<void>;
  focusTask: (task: Task) => void;
  unfocusTask: () => void;
  fetchTasks: () => Promise<void>;
  onListChange: (e: ChangeEvent<HTMLSelectElement>) => boolean;
  onLabelChange: (e: ChangeEvent<HTMLSelectElement>) => void;
}

interface Store extends State {
  actions: Action;
}

const useTasksStore = create<Store>((set, get) => ({
  tasks: [],
  focusingTask: null,
  isLoadingTasks: true,
  activeList: defaultActiveList,
  isLoadingLists: true,
  lists: [
    {
      provider: 'Flowmodor',
      name: 'Default',
      id: 'default',
    },
  ],
  activeLabel: '',
  labels: [],
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
    deleteTask: async (task) => {
      const { activeList } = get();
      const [provider] = activeList.split(' - ', 2);

      if (provider === 'Todoist') {
        const todoist = await getClient(supabase);
        if (todoist) {
          const isSuccess = await todoist.deleteTask(task.id.toString());
          if (!isSuccess) {
            toast.error('Failed to delete task');
            return;
          }
        }
      } else {
        const { error } = await supabase
          .from('tasks')
          .delete()
          .eq('id', task.id);

        if (error) {
          toast.error(error.message);
          return;
        }
      }

      set((state) => ({
        tasks: state.tasks.filter((t) => t.id !== task.id),
      }));
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
    fetchListsAndLabels: async () => {
      const todoist = await getClient(supabase);
      if (!todoist) {
        set({ isLoadingLists: false });
        return;
      }

      const lists = await todoist.getProjects();
      const todoistLists = lists.map((list) => ({
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

      const labels = await todoist.getLabels();
      set({ labels: labels.map((label) => label.name) });
    },
    focusTask: (task) => set({ focusingTask: task }),
    unfocusTask: () => set({ focusingTask: null }),
    fetchTasks: async () => {
      set({ focusingTask: null, isLoadingTasks: true });

      const { activeList } = get();
      const [provider, id] = activeList.split(' - ');

      const todoist = await getClient(supabase);

      if (provider === 'Todoist' && todoist !== null) {
        const listName = get().lists.find((list) => list.id === id)?.name;

        let filter = '';
        if (id === 'all') {
          filter = 'all';
        } else if (id === 'today') {
          filter = 'today';
        } else if (listName) {
          filter = `#${listName}`;
        }

        const tasks = await todoist.getTasks({ filter });

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

export const useLists = () => useTasksStore((s) => s.lists);
export const useFocusingTask = () => useTasksStore((s) => s.focusingTask);
export const useIsLoadingTasks = () => useTasksStore((s) => s.isLoadingTasks);
export const useActiveList = () => useTasksStore((s) => s.activeList);
export const useIsLoadingLists = () => useTasksStore((s) => s.isLoadingLists);
export const useLabels = () => useTasksStore((s) => s.labels);
export const useActiveLabel = () => useTasksStore((s) => s.activeLabel);
export const useTasksActions = () => useTasksStore((s) => s.actions);
export const useTasks = () => {
  const tasks = useTasksStore((state) => state.tasks);
  const activeLabel = useTasksStore((state) => state.activeLabel);
  const activeList = useTasksStore((state) => state.activeList);

  if (activeLabel === '' || activeList === defaultActiveList) {
    return tasks;
  }

  return tasks.filter((task) => task.labels?.includes(activeLabel));
};

export default useTasksStore;
