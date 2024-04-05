'use client';

import { Button } from '@nextui-org/react';
import { ReactNode, useState } from 'react';

export default function Tabs({ children }: { children: ReactNode[] }) {
  const [tab, setTab] = useState(0);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center bg-[#23223C] p-1 rounded-lg gap-3">
        <Button
          disableAnimation
          radius="sm"
          size="sm"
          className={`flex-1 text-sm ${
            tab === 0 ? 'bg-secondary' : 'bg-[#23223C] text-opacity-50'
          }`}
          onPress={() => setTab(0)}
        >
          Timer
        </Button>
        <Button
          disableAnimation
          radius="sm"
          size="sm"
          className={`flex-1 text-sm ${
            tab === 1 ? 'bg-secondary' : 'bg-[#23223C] text-opacity-50'
          }`}
          onPress={() => setTab(1)}
        >
          Tasks
        </Button>
      </div>
      {children[tab]}
    </div>
  );
}
