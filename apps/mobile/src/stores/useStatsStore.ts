import { createHooks, createStore } from '@flowmodor/stores/stats';
import { supabase } from '../utils/supabase';

export const store = createStore(supabase);
export const {
  usePeriod,
  useStartDate,
  useEndDate,
  useDisplayTime,
  useLogs,
  useStatsActions,
  useIsDisabled,
} = createHooks(store);
