import { createTimerHooks, createTimerStore } from '@flowmodor/stores';
import { useEffect, useState } from 'react';
import supabase from '@/utils/supabase/client';
import { statsStore } from './useStatsStore';

const timerStore = createTimerStore(supabase, statsStore);

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

export const {
  useStartTime,
  useEndTime,
  useTotalTime,
  useDisplayTime,
  useMode,
  useShowTime,
  useStatus,
  useTimerActions,
} = createTimerHooks(timerStore);
