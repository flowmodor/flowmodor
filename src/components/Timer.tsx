'use client';

import { Hide, Play, Show, Stop } from '@/components/Icons';
import { Button, CircularProgress } from '@nextui-org/react';
import { useState, useEffect } from 'react';

export default function Timer() {
  const [isRunning, setIsRunning] = useState(false);
  const [totalTime, setTotalTime] = useState(0);
  const [time, setTime] = useState(0);
  const [mode, setMode] = useState('focus');
  const [showTime, setShowTime] = useState(true);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning && mode === 'focus') {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    } else if (isRunning && mode === 'break') {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
    }

    if (!isRunning && time !== 0 && mode === 'focus') {
      setMode('break');
      setTime(Math.floor(time / 5));
      setTotalTime(Math.floor(time / 5));
    }

    if (time === 0 && mode === 'break') {
      setMode('focus');
      setIsRunning(false);
      setTime(0);

      const audio = new Audio('/alarm.mp3');
      audio.play();
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isRunning, time, mode]);

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const formatTime = (t: number) => {
    if (!showTime) return '**:**';

    const minutes = Math.floor(t / 60);
    const seconds = t % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`;
  };
  return (
    <div className="flex flex-col items-center">
      <CircularProgress
        value={mode === 'focus' ? 0 : (100 * time) / totalTime}
        size="lg"
        showValueLabel
        valueLabel={
          <div className="flex flex-col items-center gap-2">
            {formatTime(time)}
            <span className="text-2xl">
              {mode === 'focus' ? 'Focus' : 'Break'}
            </span>
          </div>
        }
        classNames={{
          svg: 'w-80 h-80 text-[#41D1FF]',
          value: 'text-5xl font-semibold',
        }}
      />
      <div className="flex gap-5">
        <Button
          variant="solid"
          isIconOnly
          onClick={() => setShowTime(!showTime)}
        >
          {showTime ? <Hide /> : <Show />}
        </Button>
        <Button variant="solid" isIconOnly onClick={toggleTimer}>
          {isRunning ? <Stop /> : <Play />}
        </Button>
      </div>
    </div>
  );
}
