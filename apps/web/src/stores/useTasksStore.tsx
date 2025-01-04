import { createHooks, createStore } from '@flowmodor/stores/tasks';
import { toast } from 'sonner';
import supabase from '@/utils/supabase/client';

export const store = createStore(supabase, toast.error);
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
