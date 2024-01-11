'use client';

import { useEffect, useState } from 'react';
import Tasks from '@/components/Tasks';
import Timer from '@/components/Timer';
import { Tabs, Tab } from '@nextui-org/tabs';
import useTimerStore from '@/stores/useTimerStore';

export default function App() {
  const { endTime, mode, isRunning, stopTimer } = useTimerStore(
    (state) => state,
  );

  const [tick, setTick] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning) {
      interval = setInterval(() => {
        setTick(tick + 1);
      }, 1000);

      if (mode === 'break' && endTime! < Date.now()) {
        stopTimer();
        const audio = new Audio('/alarm.mp3');
        audio.play();
      }
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [tick, isRunning]);

  return (
    <Tabs
      fullWidth
      variant="underlined"
      classNames={{
        tabList: 'bg-[#23223C]',
        cursor: 'bg-primary',
      }}
    >
      <Tab key="timer" title="Timer">
        <Timer />
      </Tab>
      <Tab key="tasks" title="Tasks">
        <Tasks />
      </Tab>
    </Tabs>
  );
}
