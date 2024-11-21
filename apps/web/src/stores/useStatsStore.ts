import { createStatsStore } from '@flowmodor/stores';
import supabase from '@/utils/supabase/client';

export const useStatsStore = createStatsStore(supabase);

export type Period = 'Day' | 'Week' | 'Month';
export const usePeriod = () => useStatsStore((state) => state.period);
export const useStartDate = () => useStatsStore((state) => state.startDate);
export const useEndDate = () => useStatsStore((state) => state.endDate);
export const useDisplayTime = () => useStatsStore((state) => state.displayTime);
export const useLogs = () => useStatsStore((state) => state.logs);
export const useStatsActions = () => useStatsStore((state) => state.actions);
export const useIsDisabled = () => {
  const period = usePeriod();
  const startDate = useStartDate();
  const endDate = useEndDate();
  const today = new Date();

  if (period === 'Day') {
    return today.getDate() === endDate.getDate();
  }

  if (period === 'Week') {
    return today >= startDate && today <= endDate;
  }

  return false;
};
