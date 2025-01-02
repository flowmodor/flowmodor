'use client';

import { Tab, Tabs } from '@nextui-org/tabs';
import { ReactNode, useEffect, useState } from 'react';

export default function TabsWrapper({ children }: { children: ReactNode[] }) {
  const [selected, setSelected] = useState('timer');

  useEffect(() => {
    if ('Notification' in window && Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
  }, []);

  return (
    <div className="flex h-full w-full flex-col gap-3 p-3 sm:h-auto">
      <Tabs
        fullWidth
        classNames={{
          tabList: 'bg-midground',
          cursor: '!bg-secondary',
        }}
        selectedKey={selected}
        onSelectionChange={(key) => setSelected(key.toString())}
      >
        <Tab key="timer" title="Timer" />
        <Tab key="tasks" title="Tasks" />
      </Tabs>
      {selected === 'timer' ? children[0] : children[1]}
    </div>
  );
}
