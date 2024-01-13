'use client';

import { useEffect, useState } from 'react';
import TasksTab from '@/components/TasksTab';
import TimerTab from '@/components/TimerTab/index';
import { Tabs, Tab } from '@nextui-org/tabs';
import useTimerStore from '@/stores/useTimerStore';

export default function App() {
  const { endTime, mode, isRunning, tickTimer, stopTimer } = useTimerStore(
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

    tickTimer();

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [tick, isRunning]);

  return (
    <Tabs
      fullWidth
      disableAnimation
      classNames={{
        tabList: 'bg-[#23223C]',
        cursor: 'bg-primary',
      }}
    >
      <Tab
        key="timer"
        title="Timer"
        className="data-[selected=true]:bg-secondary"
      >
        <TimerTab />
      </Tab>
      <Tab
        key="tasks"
        title="Tasks"
        className="data-[selected=true]:bg-secondary"
      >
        <TasksTab />
      </Tab>
    </Tabs>
  );
}
