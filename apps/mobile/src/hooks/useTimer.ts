import { createHooks } from '@flowmo/stores/timer';
import { store } from '../stores/timer';

export const {
  useStartTime,
  useEndTime,
  useTotalTime,
  useDisplayTime,
  useMode,
  useStatus,
  useActions,
} = createHooks(store);
