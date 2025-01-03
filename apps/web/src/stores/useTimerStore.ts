import { createStatsStore, createTimerStore } from '@flowmodor/stores';
import { useEffect, useState } from 'react';
import supabase from '@/utils/supabase/client';

const statsStore = createStatsStore(supabase);
export const useTimerStore = createTimerStore(supabase, statsStore);

export const useBreakRatio = () => {
  const [breakRatio, setBreakRatio] = useState<number>(5);
  useEffect(() => {
    (async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        setBreakRatio(5);
        return;
      }

      const { data } = await supabase
        .from('settings')
        .select('break_ratio')
        .single();
      setBreakRatio(data?.break_ratio || 5);
    })();
  }, []);
  return breakRatio;
};

export const useStartTime = () => useTimerStore((state) => state.startTime);
export const useEndTime = () => useTimerStore((state) => state.endTime);
export const useTotalTime = () => useTimerStore((state) => state.totalTime);
export const useDisplayTime = () => useTimerStore((state) => state.displayTime);
export const useMode = () => useTimerStore((state) => state.mode);
export const useShowTime = () =>
  useTimerStore((state) => state.showTime || state.status === 'idle');
export const useStatus = () => useTimerStore((state) => state.status);
export const useTimerActions = () => useTimerStore((state) => state.actions);
