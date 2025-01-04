import { Source, TaskSource } from '@flowmodor/task-sources';
import FlowmodorSource from '@flowmodor/task-sources/flowmodor';
import GoogleTasksSource from '@flowmodor/task-sources/googletasks';
import MicrosoftTodoSource from '@flowmodor/task-sources/microsofttodo';
import TickTickSource from '@flowmodor/task-sources/ticktick';
import TodoistSource from '@flowmodor/task-sources/todoist';
import { List, Task } from '@flowmodor/types';
import { SupabaseClient } from '@supabase/supabase-js';
import { create } from 'zustand';

const sourceMap = {
  [Source.Flowmodor]: FlowmodorSource,
  [Source.Todoist]: TodoistSource,
  [Source.TickTick]: TickTickSource,
  [Source.GoogleTasks]: GoogleTasksSource,
  [Source.MicrosoftTodo]: MicrosoftTodoSource,
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
  undoCompleteTask: (task: Task, listId: string | null) => Promise<void>;
  fetchSources: () => Promise<void>;
  fetchListsAndLabels: () => Promise<void>;
  focusTask: (task: Task) => void;
  unfocusTask: () => void;
  fetchTasks: () => Promise<void>;
  onSourceChange: (newSource: Source) => Promise<void>;
  onListChange: (id: string) => void;
  onLabelChange: (label: string) => void;
}

interface Store extends State {
  actions: Action;
}

export const createStore = (
  supabase: SupabaseClient,
  onError: (message: string) => void,
) =>
  create<Store>((set, get) => ({
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
          onError('Failed to add task');
        }
      },
      deleteTask: async (task) => {
        try {
          const { sourceInstance, activeList, focusingTask, actions } = get();
          if (!sourceInstance) return;

          if (focusingTask?.id === task.id) {
            actions.unfocusTask();
          }

          await sourceInstance.deleteTask(task.id, activeList ?? undefined);
          set((state) => ({
            tasks: state.tasks.filter((t) => t.id !== task.id),
          }));
        } catch (error) {
          onError('Failed to delete task');
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
          onError('Failed to complete task');
        }
      },
      undoCompleteTask: async (task, listId) => {
        try {
          const { sourceInstance } = get();
          if (!sourceInstance) return;

          await sourceInstance.undoCompleteTask(task.id, listId);
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
          onError('Failed to undo complete task');
        }
      },
      fetchSources: async () => {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          set({ isLoadingSources: false });
          return;
        }

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
              ...(data?.googletasks ? [Source.GoogleTasks] : []),
              ...(data?.microsofttodo ? [Source.MicrosoftTodo] : []),
            ],
            isLoadingSources: false,
          });
        } catch (error) {
          onError('Failed to fetch sources');
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
          onError('Failed to fetch lists and labels');
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
          const tasks = await sourceInstance.fetchTasks(
            activeList ?? undefined,
          );
          set({ tasks, isLoadingTasks: false });
        } catch (error) {
          onError('Failed to fetch tasks');
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

          if (newSource === Source.Todoist) {
            set({
              activeList: 'today',
              lists: [
                {
                  id: 'today',
                  name: 'Today',
                },
              ],
            });

            fetchTasks();
            fetchListsAndLabels();

            return;
          }

          await fetchListsAndLabels();
          await fetchTasks();
        } catch (error) {
          onError('Failed to change source');
          set({ isLoadingLists: false, isLoadingTasks: false });
        }
      },
      onListChange: (id) => {
        set({ activeList: id });
      },
      onLabelChange: (label) => {
        set({ activeLabel: label });
      },
    },
  }));

export const createHooks = (useStore: ReturnType<typeof createStore>) => ({
  useSources: () => useStore((s) => s.sources),
  useActiveSource: () => useStore((s) => s.activeSource),
  useIsLoadingSources: () => useStore((s) => s.isLoadingSources),
  useLists: () => useStore((s) => s.lists),
  useFocusingTask: () => useStore((s) => s.focusingTask),
  useIsLoadingTasks: () => useStore((s) => s.isLoadingTasks),
  useActiveList: () => useStore((s) => s.activeList),
  useIsLoadingLists: () => useStore((s) => s.isLoadingLists),
  useLabels: () => useStore((s) => s.labels),
  useActiveLabel: () => useStore((s) => s.activeLabel),
  useTasksActions: () => useStore((s) => s.actions),
  useTasks: () => {
    const tasks = useStore((state) => state.tasks);
    const activeLabel = useStore((state) => state.activeLabel);
    const activeSource = useStore((state) => state.activeSource);

    if (activeLabel === '' || activeSource === Source.Flowmodor) {
      return tasks;
    }

    return tasks.filter((task) => task.labels?.includes(activeLabel));
  },
});
