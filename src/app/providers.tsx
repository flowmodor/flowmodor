'use client';

import { NextUIProvider } from '@nextui-org/react';

// eslint-disable-next-line import/prefer-default-export
export function Providers({ children }: { children: React.ReactNode }) {
  return <NextUIProvider>{children}</NextUIProvider>;
}
