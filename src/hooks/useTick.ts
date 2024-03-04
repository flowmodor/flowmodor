import { useTour } from '@reactour/tour';
import { useEffect } from 'react';
import useLog from '@/hooks/useLog';
import useTimerStore from '@/stores/useTimerStore';

export default function useTick() {
  const { endTime, mode, isRunning, tickTimer, stopTimer } = useTimerStore(
    (state) => state,
  );
  const { log } = useLog();
  const { currentStep, setCurrentStep } = useTour();

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isRunning) {
        return;
      }

      if (mode === 'break' && endTime! < Date.now()) {
        stopTimer();
        log();
        const audio = new Audio('/alarm.mp3');
        audio.play();
        setCurrentStep(currentStep + 1);
      } else {
        tickTimer();
      }
    }, 1000);

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isRunning]);
}
