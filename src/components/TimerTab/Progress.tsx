import { CircularProgress } from '@nextui-org/progress';
import { useTour } from '@reactour/tour';
import { useEffect } from 'react';
import {
  useDisplayTime,
  useMode,
  useShowTime,
  useTotalTime,
} from '@/stores/useTimerStore';
import { formatTime } from '@/utils';

export default function Progress() {
  const totalTime = useTotalTime();
  const displayTime = useDisplayTime();
  const mode = useMode();
  const showTime = useShowTime();

  const { currentStep, setCurrentStep } = useTour();

  useEffect(() => {
    if (displayTime === 10) {
      setCurrentStep(currentStep + 1);
    }
  }, [displayTime]);

  return (
    <CircularProgress
      id="progress"
      value={
        mode === 'focus'
          ? 0
          : 100 * (displayTime / Math.floor(totalTime! / 1000))
      }
      size="lg"
      showValueLabel
      aria-label="Timer progress"
      valueLabel={
        <div className="flex flex-col items-center gap-2">
          {showTime ? formatTime(displayTime) : '**:**'}
          <span className="text-2xl">
            {mode === 'focus' ? 'Focus' : 'Break'}
          </span>
        </div>
      }
      classNames={{
        svg: 'w-full sm:w-80 h-80 text-primary',
        track: 'stroke-secondary',
        value: `${
          displayTime >= 3600 ? 'text-3xl sm:text-4xl' : 'text-4xl sm:text-5xl'
        } font-semibold`,
      }}
    />
  );
}
