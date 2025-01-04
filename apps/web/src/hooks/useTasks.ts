import { createHooks } from '@flowmodor/stores/tasks';
import { store } from '@/stores/tasks';

export const {
  useSources,
  useActiveSource,
  useIsLoadingSources,
  useLists,
  useFocusingTask,
  useIsLoadingTasks,
  useActiveList,
  useIsLoadingLists,
  useLabels,
  useActiveLabel,
  useTasksActions,
  useTasks,
} = createHooks(store);
