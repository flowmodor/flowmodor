'use client';

import { Card, CardBody } from '@nextui-org/card';
import { Hide, Play, Show, Stop } from '@/components/Icons';
import { Button, CircularProgress } from '@nextui-org/react';
import { useEffect } from 'react';
import { formatTime } from '@/utils';
import { useTimerStore } from '@/stores';

export default function Timer() {
  const time = useTimerStore((state) => state.time);
  const totalTime = useTimerStore((state) => state.totalTime);
  const mode = useTimerStore((state) => state.mode);
  const showTime = useTimerStore((state) => state.showTime);
  const isRunning = useTimerStore((state) => state.isRunning);
  const countUp = useTimerStore((state) => state.countUp);
  const countDown = useTimerStore((state) => state.countDown);
  const startFocus = useTimerStore((state) => state.startFocus);
  const startBreak = useTimerStore((state) => state.startBreak);
  const toggleShowTime = useTimerStore((state) => state.toggleShowTime);
  const toggleTimer = useTimerStore((state) => state.toggleTimer);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning && mode === 'focus') {
      interval = setInterval(countUp, 1000);
    } else if (isRunning && mode === 'break') {
      interval = setInterval(countDown, 1000);
    }

    if (!isRunning && time !== 0 && mode === 'focus') {
      startBreak();
    }

    if (time === 0 && mode === 'break') {
      startFocus();

      const audio = new Audio('/alarm.mp3');
      audio.play();
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isRunning, time, mode]);

  return (
    <div className="flex flex-col gap-5">
      <Card className="h-[30rem] w-[30rem] bg-[#23223C]">
        <CardBody>
          <div className="flex h-full flex-col items-center justify-center">
            <CircularProgress
              value={mode === 'focus' ? 0 : (100 * time) / totalTime}
              size="lg"
              showValueLabel
              valueLabel={
                <div className="flex flex-col items-center gap-2">
                  {showTime ? formatTime(time) : '**:**'}
                  <span className="text-2xl">
                    {mode === 'focus' ? 'Focus' : 'Break'}
                  </span>
                </div>
              }
              classNames={{
                svg: 'w-80 h-80 text-primary',
                track: 'stroke-secondary',
                value: 'text-5xl font-semibold',
              }}
            />
          </div>
        </CardBody>
      </Card>
      <Card className="bg-[#23223C]">
        <CardBody>
          <div className="flex justify-center gap-5">
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
              type="button"
              variant="flat"
              isIconOnly
              className="bg-secondary"
              onPress={toggleTimer}
            >
              {isRunning ? <Stop /> : <Play />}
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
