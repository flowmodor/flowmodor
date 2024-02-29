'use client';

import { Tab, Tabs } from '@nextui-org/tabs';
import Menu from '@/components/Menu';
import TasksTab from '@/components/TasksTab';
import TimerTab from '@/components/TimerTab/index';
import useTick from '@/hooks/useTick';

export default function App() {
  useTick();

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
