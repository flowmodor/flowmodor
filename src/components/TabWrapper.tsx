import { ReactNode } from 'react';

export default function TabWrapper({ children }: { children: ReactNode }) {
  return <div className="w-min flex flex-col gap-5">{children}</div>;
}
