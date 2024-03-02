import Menu from '@/components/Menu';
import { Providers } from './providers';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <Menu />
      {children}
    </Providers>
  );
}
