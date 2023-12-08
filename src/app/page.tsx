'use client';

import { Button, CircularProgress } from '@nextui-org/react';
import { useState, useEffect } from 'react';

export default function Home() {
  const [isRunning, setIsRunning] = useState(false);
  const [totalTime, setTotalTime] = useState(0);
  const [time, setTime] = useState(0);
  const [mode, setMode] = useState('focus');

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
    const minutes = Math.floor(t / 60);
    const seconds = t % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`;
  };

  const buttonText = () => {
    if (isRunning) {
      return 'Stop';
    }
    if (mode === 'focus') {
      return 'Start Focus';
    }
    return 'Start Break';
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <CircularProgress
        value={mode === 'focus' ? 100 : (100 * time) / totalTime}
        size="lg"
        showValueLabel
        valueLabel={formatTime(time)}
        classNames={{
          svg: 'w-52 h-52 text-[#41D1FF]',
          value: 'text-3xl font-semibold',
        }}
      />
      <Button variant="flat" onClick={toggleTimer}>
        {buttonText()}
      </Button>
    </div>
  );
}
