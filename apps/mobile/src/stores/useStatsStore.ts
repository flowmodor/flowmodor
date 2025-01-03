import { createStatsHooks, createStatsStore } from '@flowmodor/stores';
import { supabase } from '../utils/supabase';

export const statsStore = createStatsStore(supabase);

export const {
  usePeriod,
  useStartDate,
  useEndDate,
  useDisplayTime,
  useLogs,
  useStatsActions,
  useIsDisabled,
} = createStatsHooks(statsStore);
