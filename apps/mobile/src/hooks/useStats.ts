import { createHooks } from '@flowmo/stores/stats';
import { store } from '@/src/stores/stats';

export const {
  usePeriod,
  useStartDate,
  useEndDate,
  useDisplayTime,
  useLogs,
  useStatsActions,
  useIsDisabled,
} = createHooks(store);
