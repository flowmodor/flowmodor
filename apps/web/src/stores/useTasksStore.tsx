'use client';

import { Task } from '@flowmodor/types';
import { ChangeEvent } from 'react';
import { toast } from 'sonner';
import { create } from 'zustand';
import supabase from '@/utils/supabase';
import getClient from '@/utils/todoist';

export enum Source {
  Flowmodor = 'Flowmodor',
  Todoist = 'Todoist',
  TickTick = 'TickTick',
}

interface List {
  name: string;
  id: string;
}

interface State {
  tasks: Task[];
  focusingTask: Task | null;
  isLoadingTasks: boolean;
  sources: Source[];
  activeSource: Source;
  isLoadingSources: boolean;
  activeList: string | null;
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
  fetchSources: () => Promise<void>;
  fetchListsAndLabels: () => Promise<void>;
  focusTask: (task: Task) => void;
  unfocusTask: () => void;
  fetchTasks: () => Promise<void>;
  onSourceChange: (newSource: Source) => Promise<void>;
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
  sources: [Source.Flowmodor],
  activeSource: Source.Flowmodor,
  isLoadingSources: true,
  activeList: null,
  isLoadingLists: true,
  lists: [],
  activeLabel: '',
  labels: [],
  actions: {
    addTask: async (name) => {
      const { tasks, activeSource, activeList, activeLabel: label } = get();
      if (activeSource === Source.Flowmodor) {
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
      } else if (activeSource === Source.Todoist) {
        const todoist = await getClient(supabase);

        if (todoist === null) {
          return;
        }

        try {
          const { id } = await todoist.addTask({
            content: name,
            ...(activeList !== 'all' &&
              activeList !== 'today' && { project_id: activeList }),
            ...(activeList === 'today' && { due_string: 'today' }),
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
      }
    },
    deleteTask: async (task) => {
      const { activeSource } = get();

      if (activeSource === Source.Flowmodor) {
        const { error } = await supabase
          .from('tasks')
          .delete()
          .eq('id', task.id);

        if (error) {
          toast.error(error.message);
          return;
        }
      } else if (activeSource === Source.Todoist) {
        const todoist = await getClient(supabase);

        if (!todoist) {
          return;
        }

        const isSuccess = await todoist.deleteTask(task.id.toString());
        if (!isSuccess) {
          toast.error('Failed to delete task');
          return;
        }
      }

      set((state) => ({
        tasks: state.tasks.filter((t) => t.id !== task.id),
      }));
    },
    completeTask: async (task) => {
      const { activeSource, focusingTask, actions } = get();

      if (focusingTask?.id === task.id) {
        actions.unfocusTask();
      }

      if (activeSource === Source.Flowmodor) {
        const { error } = await supabase
          .from('tasks')
          .update({ completed: true })
          .eq('id', task.id)
          .select();

        if (error) {
          toast.error(error.message);
          return;
        }
      } else if (activeSource === Source.Todoist) {
        const todoist = await getClient(supabase);

        if (!todoist) {
          return;
        }

        const isSuccess = await todoist.closeTask(task.id.toString());
        if (!isSuccess) {
          toast.error('Failed to complete task');
          return;
        }
      }

      set((state) => ({
        tasks: state.tasks.filter((t) => t.id !== task.id),
      }));
    },
    undoCompleteTask: async (task) => {
      const { activeSource } = get();

      if (activeSource === Source.Flowmodor) {
        const { error } = await supabase
          .from('tasks')
          .update({ completed: false })
          .eq('id', task.id)
          .select();

        if (error) {
          toast.error(error.message);
          return;
        }
      } else if (activeSource === Source.Todoist) {
        const todoist = await getClient(supabase);

        if (!todoist) {
          return;
        }

        const isSuccess = await todoist.reopenTask(task.id.toString());
        if (!isSuccess) {
          toast.error('Failed to undo complete task');
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
    fetchSources: async () => {
      const { data } = await supabase.from('integrations').select('*').single();
      set((state) => ({
        sources: [
          ...state.sources,
          ...(data?.todoist ? [Source.Todoist] : []),
          ...(data?.ticktick ? [Source.TickTick] : []),
        ],
        isLoadingSources: false,
      }));
    },
    fetchListsAndLabels: async () => {
      const { activeSource } = get();

      if (activeSource === Source.Flowmodor) {
        set({ isLoadingLists: false });
      } else if (activeSource === Source.Todoist) {
        const todoist = await getClient(supabase);
        if (!todoist) {
          set({ isLoadingLists: false });
          return;
        }

        const lists = await todoist.getProjects();
        const todoistLists = lists.map((list) => ({
          name: list.name,
          id: list.id,
        }));

        set(() => ({
          lists: [
            { name: 'Today', id: 'today' },
            ...todoistLists,
            { name: 'All', id: 'all' },
          ],
          activeList: 'today',
          isLoadingLists: false,
        }));

        const labels = await todoist.getLabels();
        set({ labels: labels.map((label) => label.name) });
      }
    },
    focusTask: (task) => set({ focusingTask: task }),
    unfocusTask: () => set({ focusingTask: null }),
    fetchTasks: async () => {
      set({ focusingTask: null, isLoadingTasks: true });

      const { activeSource, activeList } = get();

      if (activeSource === Source.Flowmodor) {
        const { data } = await supabase
          .from('tasks')
          .select('*')
          .is('completed', false);
        set({ tasks: data!, isLoadingTasks: false });
      } else if (activeSource === Source.Todoist) {
        const todoist = await getClient(supabase);
        if (todoist === null) {
          set({ isLoadingTasks: false });
          return;
        }

        const listName = get().lists.find(
          (list) => list.id === activeList,
        )?.name;

        let filter = '';
        if (activeList === 'all') {
          filter = 'all';
        } else if (activeList === 'today') {
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
      }
    },
    onSourceChange: async (newSource) => {
      set({
        isLoadingLists: true,
        isLoadingTasks: true,
        activeSource: newSource,
      });

      const {
        actions: { fetchListsAndLabels, fetchTasks },
      } = get();

      await fetchListsAndLabels();
      await fetchTasks();
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

export const useSources = () => useTasksStore((s) => s.sources);
export const useActiveSource = () => useTasksStore((s) => s.activeSource);
export const useIsLoadingSources = () =>
  useTasksStore((s) => s.isLoadingSources);
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
  const activeSource = useTasksStore((state) => state.activeSource);

  if (activeLabel === '' || activeSource === Source.Flowmodor) {
    return tasks;
  }

  return tasks.filter((task) => task.labels?.includes(activeLabel));
};

export default useTasksStore;
