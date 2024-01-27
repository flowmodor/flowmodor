import supabase from '@/utils/supabase';
import { useEffect, useState } from 'react';

export default function useIsPro() {
  const [isPro, setIsPro] = useState(false);

  useEffect(() => {
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { error, data } = await supabase
        .from('plans')
        .select('end_time, status')
        .eq('user_id', user?.id)
        .single();

      if (error) {
        return;
      }

      const { status, end_time: endTime } = data;
      if (status === 'ACTIVE' || new Date(endTime) > new Date()) {
        setIsPro(true);
      }
    })();
  }, []);

  return isPro;
}
