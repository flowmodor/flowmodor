import { ReactNode } from 'react';

export default function TabWrapper({ children }: { children: ReactNode }) {
  return <div className="flex w-min flex-col gap-5">{children}</div>;
}
