import { useEffect } from 'react';
import { useActions, useStatus } from '@/src/stores/useTimerStore';

export default function useTick() {
  const status = useStatus();
  const { tick } = useActions();

  useEffect(() => {
    const interval = setInterval(() => {
      if (status !== 'running') {
        return;
      }

      tick();
    }, 1000);

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [status, tick]);
}
