'use client';

import { Button } from '@nextui-org/react';
import { useState } from 'react';

export default function Home() {
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout>();

  const startTimer = () => {
    console.log('start');
    setIntervalId(
      setInterval(() => {
        setTimer(prevTimer => prevTimer + 1);
      }, 1000),
    );
  };

  const stopTimer = () => {
    console.log('stop');
    if (intervalId) {
      clearInterval(intervalId);
    }
    setIsRunning(false);
  };

  return (
    <>
      <Button
        onClick={() => {
          if (isRunning) {
            stopTimer();
          } else {
            startTimer();
          }
          setIsRunning(!isRunning);
        }}
      >
        {isRunning ? 'Stop' : 'Start'}
      </Button>
      {timer}
    </>
  );
}
