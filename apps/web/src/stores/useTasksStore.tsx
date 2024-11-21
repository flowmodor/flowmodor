'use client';

import { List, Task } from '@flowmodor/types';
import { ChangeEvent } from 'react';
import { toast } from 'sonner';
import { create } from 'zustand';
import supabase from '@/utils/supabase/client';
import { Source, TaskSource } from './sources';
import FlowmodorSource from './sources/flowmodor';
import TickTickSource from './sources/ticktick';
import TodoistSource from './sources/todoist';

const sourceMap = {
  [Source.Flowmodor]: FlowmodorSource,
  [Source.Todoist]: TodoistSource,
  [Source.TickTick]: TickTickSource,
};

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
  sourceInstance: TaskSource | null;
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
  lists: [],
  isLoadingLists: true,
  activeLabel: '',
  labels: [],
  sourceInstance: new FlowmodorSource(supabase),
  actions: {
    addTask: async (name) => {
      try {
        const { sourceInstance, tasks, activeList, activeLabel } = get();
        if (!sourceInstance) return;

        const task = await sourceInstance.addTask(name, {
          listId: activeList ?? undefined,
          label: activeLabel || undefined,
        });

        set({ tasks: [...tasks, task] });
      } catch (error) {
        toast.error('Failed to add task');
      }
    },
    deleteTask: async (task) => {
      try {
        const { sourceInstance, activeList } = get();
        if (!sourceInstance) return;

        await sourceInstance.deleteTask(task.id, activeList ?? undefined);
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== task.id),
        }));
      } catch (error) {
        toast.error('Failed to delete task');
      }
    },
    completeTask: async (task) => {
      try {
        const { sourceInstance, focusingTask, actions, activeList } = get();
        if (!sourceInstance) return;

        if (focusingTask?.id === task.id) {
          actions.unfocusTask();
        }

        await sourceInstance.completeTask(task.id, activeList ?? undefined);
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== task.id),
        }));
      } catch (error) {
        toast.error('Failed to complete task');
      }
    },
    undoCompleteTask: async (task) => {
      try {
        const { sourceInstance } = get();
        if (!sourceInstance) return;

        await sourceInstance.undoCompleteTask(task.id);
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
      } catch (error) {
        toast.error('Failed to undo complete task');
      }
    },
    fetchSources: async () => {
      try {
        const { data } = await supabase
          .from('integrations')
          .select('*')
          .single();
        set({
          sources: [
            Source.Flowmodor,
            ...(data?.todoist ? [Source.Todoist] : []),
            ...(data?.ticktick ? [Source.TickTick] : []),
          ],
          isLoadingSources: false,
        });
      } catch (error) {
        toast.error('Failed to fetch sources');
        set({ isLoadingSources: false });
      }
    },
    fetchListsAndLabels: async () => {
      try {
        const { sourceInstance } = get();
        if (!sourceInstance) return;

        const [lists, labels] = await Promise.all([
          sourceInstance.fetchLists(),
          sourceInstance.fetchLabels(),
        ]);

        set({
          lists,
          labels,
          activeList: lists.length > 0 ? lists[0].id : null,
          isLoadingLists: false,
        });
      } catch (error) {
        toast.error('Failed to fetch lists and labels');
        set({ isLoadingLists: false });
      }
    },
    focusTask: (task) => set({ focusingTask: task }),
    unfocusTask: () => set({ focusingTask: null }),
    fetchTasks: async () => {
      try {
        const { sourceInstance, activeList } = get();
        if (!sourceInstance) return;

        set({ focusingTask: null, isLoadingTasks: true });
        const tasks = await sourceInstance.fetchTasks(activeList ?? undefined);
        set({ tasks, isLoadingTasks: false });
      } catch (error) {
        toast.error('Failed to fetch tasks');
        set({ isLoadingTasks: false });
      }
    },
    onSourceChange: async (newSource) => {
      try {
        set({
          isLoadingLists: true,
          isLoadingTasks: true,
          activeSource: newSource,
          sourceInstance: new sourceMap[newSource](supabase),
        });

        const {
          actions: { fetchListsAndLabels, fetchTasks },
        } = get();

        await fetchListsAndLabels();
        await fetchTasks();
      } catch (error) {
        toast.error('Failed to change source');
        set({ isLoadingLists: false, isLoadingTasks: false });
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
