import { createHooks } from '@flowmodor/stores/timer';
import { useEffect, useState } from 'react';
import { store } from '@/stores/timer';
import supabase from '@/utils/supabase/client';

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
  useActions,
} = createHooks(store);
