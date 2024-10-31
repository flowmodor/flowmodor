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

      tickTimer(() => {
        const audio = new Audio('/alarm.mp3');
        audio.play();

        // eslint-disable-next-line no-new
        new Notification('Flowmodor', {
          body: 'Time to get back to work!',
          icon: '/images/icons/general_icon_x512.png',
        });
      });
    }, 1000);

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [status, tickTimer]);
}
