import { useTour } from '@reactour/tour';
import { useEffect } from 'react';
import { useStatus, useTimerActions } from '@/stores/useTimerStore';

export default function useTick() {
  const status = useStatus();
  const { tickTimer } = useTimerActions();
  const { currentStep, setCurrentStep } = useTour();

  useEffect(() => {
    const interval = setInterval(() => {
      if (status !== 'running') {
        return;
      }

      tickTimer(() => {
        setCurrentStep(currentStep + 1);
      });
    }, 1000);

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [status]);
}
