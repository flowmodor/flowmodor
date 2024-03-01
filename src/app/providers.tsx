'use client';

import { NextUIProvider } from '@nextui-org/react';
import { useRouter } from 'next/navigation';

// eslint-disable-next-line import/prefer-default-export
export function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  return <NextUIProvider navigate={router.push}>{children}</NextUIProvider>;
}
