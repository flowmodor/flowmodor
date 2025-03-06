import { createHooks } from '@flowmo/stores/tasks';
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
  useIsLoadingLabels,
  useLabels,
  useActiveLabel,
  useTasksActions,
  useTasks,
  useSupportsLabels,
} = createHooks(store);
