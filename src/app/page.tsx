'use client';

import Tasks from '@/components/Tasks';
import Timer from '@/components/Timer';
import { Tabs, Tab } from '@nextui-org/tabs';

export default function App() {
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
