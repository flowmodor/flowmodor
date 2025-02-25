'use client';

import { CircularProgress } from '@heroui/progress';
import { useEffect } from 'react';
import TimeDisplay from '@/components/TimeDisplay';
import {
  useDisplayTime,
  useMode,
  useShowTime,
  useStatus,
  useTotalTime,
} from '@/hooks/useTimer';
import { formatTime } from '@/utils';
import TaskSelector from './TaskSelector';

export default function Progress() {
  const totalTime = useTotalTime();
  const displayTime = useDisplayTime();
  const mode = useMode();
  const status = useStatus();
  const showTime = useShowTime();

  const hours = Math.floor(displayTime / 3600);
  const minutes = Math.floor((displayTime % 3600) / 60);
  const seconds = displayTime % 60;

  useEffect(() => {
    document.title =
      showTime && status !== 'idle' ? formatTime(displayTime) : 'Flowmodor';
  }, [displayTime, showTime, status]);

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
        <div className="flex flex-col items-center">
          <span id="mode" className={showTime ? 'text-2xl' : 'text-3xl'}>
            {mode === 'focus' ? 'Focus' : 'Break'}
          </span>
          {showTime && (
            <TimeDisplay
              {...(hours > 0 ? { hours } : {})}
              minutes={minutes}
              seconds={seconds}
            />
          )}
          <TaskSelector />
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
