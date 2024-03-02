'use client';

import mixpanel from 'mixpanel-browser';
import { useEffect } from 'react';
import supabase from '@/utils/supabase';

// eslint-disable-next-line import/prefer-default-export
export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user?.id) {
        mixpanel.identify(data.user.id);
      }
    })();
  }, []);
  return children;
}
