import { createHooks } from '@flowmo/stores/tasks';
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
