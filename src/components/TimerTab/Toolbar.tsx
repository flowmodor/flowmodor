import { Button } from '@nextui-org/button';
import { useTour } from '@reactour/tour';
import { useTransition } from 'react';
import { Hide, Play, Show, Stop } from '@/components/Icons';
import useTimerStore from '@/stores/useTimerStore';

export default function Toolbar() {
  const { showTime, isRunning, startTimer, stopTimer, log, toggleShowTime } =
    useTimerStore((state) => state);
  const { currentStep, setCurrentStep } = useTour();
  const [isLoading, startTransition] = useTransition();

  return (
    <div className="flex items-center justify-center gap-5">
      <Button
        type="button"
        variant="flat"
        isIconOnly
        className="bg-secondary"
        onPress={toggleShowTime}
      >
        {showTime ? <Hide /> : <Show />}
      </Button>
      <Button
        id="start-stop-button"
        type="button"
        variant="flat"
        isLoading={isLoading}
        isIconOnly
        className="bg-secondary"
        onPress={() => {
          startTransition(async () => {
            if (isRunning) {
              await log();
              await stopTimer();
            } else {
              await startTimer();
            }
          });
          setCurrentStep(currentStep + 1);
        }}
      >
        {isRunning ? <Stop /> : <Play />}
      </Button>
    </div>
  );
}
