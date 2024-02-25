'use client';

import { Tab, Tabs } from '@nextui-org/tabs';
import { useEffect, useState, useTransition } from 'react';
import Menu from '@/components/Menu';
import TasksTab from '@/components/TasksTab';
import TimerTab from '@/components/TimerTab/index';
import useLists from '@/hooks/useLists';
import useLog from '@/hooks/useLog';
import useTasksStore from '@/stores/useTasksStore';
import useTimerStore from '@/stores/useTimerStore';

export default function App() {
  const { endTime, mode, isRunning, tickTimer, stopTimer } = useTimerStore(
    (state) => state,
  );
  const { fetchTasks, subscribeToTasks } = useTasksStore((state) => state);
  const [isPending, startTransition] = useTransition();
  const [tick, setTick] = useState(0);
  const { lists } = useLists();
  const { log } = useLog();

  useEffect(() => {
    startTransition(fetchTasks);
    subscribeToTasks();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning) {
      interval = setInterval(() => {
        setTick(tick + 1);
      }, 1000);

      if (mode === 'break' && endTime! < Date.now()) {
        stopTimer();
        log();
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
          <TasksTab isPending={isPending} lists={lists} />
        </Tab>
      </Tabs>
    </div>
  );
}
