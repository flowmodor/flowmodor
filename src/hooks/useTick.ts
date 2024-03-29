import { useTour } from '@reactour/tour';
import { useEffect } from 'react';
import useTimerStore from '@/stores/useTimerStore';

export default function useTick() {
  const { status, tickTimer } = useTimerStore((state) => state);
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
