'use client';

import { Button } from '@nextui-org/button';
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@nextui-org/dropdown';
import { signOut } from '@/actions/auth';
import { Bars } from '@/components/Icons';

export default function Menu() {
  return (
    <div className="absolute right-5 top-5 mb-5 flex justify-end gap-3">
      <Dropdown
        classNames={{
          content: 'bg-[#23223C]',
        }}
      >
        <DropdownTrigger>
          <Button
            type="button"
            variant="flat"
            isIconOnly
            className="bg-[#23223C]"
          >
            <Bars />
          </Button>
        </DropdownTrigger>
        <DropdownMenu aria-label="Static Actions">
          <DropdownItem
            key="stats"
            href="stats"
            className="data-[focus=true]:bg-secondary data-[hover=true]:bg-secondary"
          >
            Stats
          </DropdownItem>
          <DropdownItem
            key="plans"
            href="plans"
            className="data-[focus=true]:bg-secondary data-[hover=true]:bg-secondary"
          >
            Plans
          </DropdownItem>
          <DropdownItem
            key="settings"
            href="/settings"
            className="data-[focus=true]:bg-secondary data-[hover=true]:bg-secondary"
          >
            Settings
          </DropdownItem>
          <DropdownItem
            key="feedback"
            href="/feedback"
            className="data-[focus=true]:bg-secondary data-[hover=true]:bg-secondary"
          >
            Feedback
          </DropdownItem>
          <DropdownItem
            key="signout"
            className="data-[focus=true]:bg-secondary data-[hover=true]:bg-secondary"
            onPress={async () => {
              await signOut();
            }}
          >
            Sign out
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
}
