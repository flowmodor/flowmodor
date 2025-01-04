import { createHooks, createStore } from '@flowmodor/stores/tasks';
import 'react-native-get-random-values';
import { supabase } from '../utils/supabase';

export const store = createStore(supabase, console.error);
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
