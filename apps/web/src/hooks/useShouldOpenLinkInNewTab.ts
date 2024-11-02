import { usePathname } from 'next/navigation';
import { useStatus } from '@/stores/useTimerStore';

export default function useShouldOpenLinkInNewTab() {
  const status = useStatus();
  const pathname = usePathname();

  return status !== 'idle' && pathname === '/';
}
