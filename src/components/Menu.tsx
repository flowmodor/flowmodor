import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from '@nextui-org/dropdown';
import { Button } from '@nextui-org/button';
import { Bars } from '@/components/Icons';
import useSignOut from '@/hooks/useSignOut';
import { useRouter } from 'next/navigation';

export default function Menu() {
  const { signOut } = useSignOut();
  const router = useRouter();

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
            key="home"
            href="/"
            className="data-[focus=true]:bg-secondary data-[hover=true]:bg-secondary"
          >
            Home
          </DropdownItem>
          {
          // <DropdownItem
          //   key="stats"
          //   href="stats"
          //   className="data-[focus=true]:bg-secondary data-[hover=true]:bg-secondary"
          // >
          //   Stats
          // </DropdownItem>
          }
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
              router.push('/signin');
            }}
          >
            Sign out
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
}
