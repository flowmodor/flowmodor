'use client';

import { Tab, Tabs } from '@nextui-org/tabs';
import { useEffect } from 'react';
import Menu from '@/components/Menu';
import TasksTab from '@/components/TasksTab';
import TimerTab from '@/components/TimerTab/index';
import useLog from '@/hooks/useLog';
import useTimerStore from '@/stores/useTimerStore';

export default function App() {
  const { endTime, mode, isRunning, tickTimer, stopTimer } = useTimerStore(
    (state) => state,
  );
  const { log } = useLog();

  useEffect(() => {
    if (!isRunning) {
      return () => {};
    }

    const interval = setInterval(() => {
      if (mode === 'break' && endTime! < Date.now()) {
        stopTimer();
        log();
        const audio = new Audio('/alarm.mp3');
        audio.play();
      } else {
        tickTimer();
      }
    }, 1000);

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isRunning]);

  return (
    <div className="flex h-full flex-col justify-center">
      <Menu />
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
    </div>
  );
}
