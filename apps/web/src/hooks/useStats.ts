import { createHooks } from '@flowmodor/stores/stats';
import { store } from '@/stores/stats';

export const {
  usePeriod,
  useStartDate,
  useEndDate,
  useDisplayTime,
  useLogs,
  useStatsActions,
  useIsDisabled,
} = createHooks(store);
