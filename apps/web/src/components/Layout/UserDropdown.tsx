'use client';

import { Avatar } from '@nextui-org/avatar';
import { Divider } from '@nextui-org/divider';
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@nextui-org/dropdown';
import { signOut } from '@/actions/auth';
import { User } from '../Icons';

export default function UserDropdown({ user }: { user: any }) {
  return (
    <Dropdown
      classNames={{
        content: 'bg-midground',
      }}
    >
      <DropdownTrigger>
        <Avatar
          as="button"
          color="secondary"
          size="sm"
          isBordered
          showFallback
          src={user.user_metadata?.avatar_url}
          fallback={<User />}
          className="mt-auto"
        />
      </DropdownTrigger>
      <DropdownMenu aria-label="user info menu">
        <DropdownItem
          key="info"
          textValue="info"
          className="data-[focus=true]:outline-none data-[focus=true]:bg-transparent data-[hover=true]:bg-transparent pointer-events-none"
        >
          <div className="text-foreground-500 text-xs">Signed in as</div>
          <div>{user.email}</div>
          <Divider className="mt-3" />
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
  );
}
