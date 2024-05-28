'use client';

import { Select, SelectItem } from '@nextui-org/select';
import { ReactNode, useState } from 'react';
import SuggestButton from './SuggestButton';

const tabs = [
  {
    key: 'top',
    label: 'Top',
  },
  {
    key: 'new',
    label: 'New',
  },
];

export default function Tabs({
  children,
  user,
}: {
  children: ReactNode[];
  user: any;
}) {
  const [tab, setTab] = useState(0);

  return (
    <div className="flex flex-col bg-midground rounded-lg gap-6 p-5">
      <div className="flex justify-between items-center">
        <Select
          size="sm"
          selectionMode="single"
          selectedKeys={[tabs[tab].key]}
          onChange={(e) => {
            if (e.target.value === '') {
              return;
            }

            setTab(tabs.findIndex(({ key }) => key === e.target.value));
          }}
          classNames={{
            base: 'max-w-[7rem]',
            trigger: 'bg-secondary data-[hover=true]:bg-secondary',
            popoverContent: 'bg-background',
          }}
        >
          {tabs.map(({ key, label }) => (
            <SelectItem
              key={key}
              classNames={{
                base: 'data-[focus=true]:!bg-secondary data-[hover=true]:!bg-secondary',
              }}
            >
              {label}
            </SelectItem>
          ))}
        </Select>
        <SuggestButton user={user} />
      </div>
      {children[tab]}
    </div>
  );
}
