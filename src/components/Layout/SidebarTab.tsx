'use client';

import { Button } from '@nextui-org/button';
import { Kbd } from '@nextui-org/kbd';
import { Tooltip } from '@nextui-org/tooltip';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ReactNode } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';

export default function SidebarTab({
  children,
  tabPathname,
  tabName,
  hotkey,
}: {
  children: ReactNode;
  tabPathname: string;
  tabName: string;
  hotkey: string;
}) {
  const pathname = usePathname();
  const router = useRouter();

  useHotkeys(hotkey, () => {
    router.push(tabPathname);
  });

  return (
    <Tooltip
      color="secondary"
      content={
        <div className="flex items-center gap-1">
          {tabName} <Kbd className="bg-midground">{hotkey}</Kbd>
        </div>
      }
      placement="right"
      offset={15}
      delay={1000}
      radius="sm"
    >
      <Button
        as={Link}
        href={tabPathname}
        disableRipple
        isIconOnly
        color="secondary"
        radius="sm"
        className={`hover:bg-secondary fill-white ${
          pathname === tabPathname ? 'bg-secondary' : 'bg-transparent'
        }`}
      >
        {children}
      </Button>
    </Tooltip>
  );
}
