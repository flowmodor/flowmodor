import { useEffect } from 'react';
import { useStatus, useTimerActions } from '@/stores/useTimerStore';

export default function useTick() {
  const status = useStatus();
  const { tickTimer } = useTimerActions();

  useEffect(() => {
    const interval = setInterval(() => {
      if (status !== 'running') {
        return;
      }

      tickTimer();
    }, 1000);

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [status, tickTimer]);
}
