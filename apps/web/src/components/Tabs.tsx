'use client';

import { Card, CardBody } from '@nextui-org/card';
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
    <div>
      <Card className="hidden lg:block bg-midground">
        <CardBody className="flex flex-col lg:flex-row gap-2">
          {children[0]}
          {children[1]}
        </CardBody>
      </Card>
      <div className="flex flex-col w-full gap-3 lg:hidden">
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
    </div>
  );
}
