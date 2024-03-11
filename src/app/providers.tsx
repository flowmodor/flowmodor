'use client';

import { NextUIProvider } from '@nextui-org/react';
import mixpanel from 'mixpanel-browser';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

// eslint-disable-next-line import/prefer-default-export
export function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  useEffect(() => {
    mixpanel.init(process.env.NEXT_PUBLIC_MIXPANEL_TOKEN, {
      debug: process.env.NODE_ENV === 'development',
      track_pageview: true,
      persistence: 'localStorage',
    });
  }, []);
  return (
    <NextUIProvider navigate={router.push} className="w-full">
      {children}
    </NextUIProvider>
  );
}
