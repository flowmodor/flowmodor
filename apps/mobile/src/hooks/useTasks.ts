import { createHooks } from '@flowmodor/stores/tasks';
import { store } from '@/src/stores/tasks';

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
