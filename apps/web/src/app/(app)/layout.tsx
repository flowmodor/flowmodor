import { ReactNode } from 'react';
import Sidebar from '@/components/Layout/Sidebar';

export default async function AppLayout({ children }: { children: ReactNode }) {
  return <Sidebar>{children}</Sidebar>;
}
