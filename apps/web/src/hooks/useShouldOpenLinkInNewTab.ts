import { usePathname } from 'next/navigation';
import { useStatus } from '@/hooks/useTimer';

export default function useShouldOpenLinkInNewTab() {
  const status = useStatus();
  const pathname = usePathname();

  return status !== 'idle' && pathname === '/';
}
