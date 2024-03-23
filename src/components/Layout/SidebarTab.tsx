'use client';

import { Button } from '@nextui-org/button';
import { Tooltip } from '@nextui-org/tooltip';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

export default function SidebarTab({
  children,
  tabPathname,
  tabName,
}: {
  children: ReactNode;
  tabPathname: string;
  tabName: string;
}) {
  const pathname = usePathname();

  return (
    <Tooltip
      color="secondary"
      content={tabName}
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
