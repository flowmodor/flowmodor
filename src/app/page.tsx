'use client';

import { Button, CircularProgress } from '@nextui-org/react';
import { useState, useEffect } from 'react';

function PlayIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="white"
      height="16"
      width="12"
      viewBox="0 0 384 512"
    >
      <path d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80V432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z" />
    </svg>
  );
}

function StopIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="white"
      height="16"
      width="12"
      viewBox="0 0 384 512"
    >
      <path d="M0 128C0 92.7 28.7 64 64 64H320c35.3 0 64 28.7 64 64V384c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V128z" />
    </svg>
  );
}

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
    const minutes = Math.floor(t / 60);
    const seconds = t % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`;
  };

  return (
    <div className="flex h-full flex-col items-center justify-center dark">
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
          svg: 'w-96 h-96 text-[#41D1FF]',
          value: 'text-5xl font-semibold',
        }}
      />
      <Button variant="solid" onClick={toggleTimer} isIconOnly>
        {isRunning ? <StopIcon /> : <PlayIcon />}
      </Button>
    </div>
  );
}
