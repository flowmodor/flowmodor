import { Button } from '@nextui-org/button';
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@nextui-org/dropdown';
import { Download, Share, X } from '@/components/Icons';

export default function ShareButton({
  handleShare,
}: {
  handleShare: (openX: boolean) => void;
}) {
  return (
    <Dropdown
      placement="right"
      offset={28}
      classNames={{
        content: 'bg-midground',
      }}
    >
      <DropdownTrigger>
        <Button
          isIconOnly
          color="secondary"
          size="sm"
          className="absolute top-5 right-5 fill-white"
        >
          <Share />
        </Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="share menu">
        <DropdownItem
          startContent={<Download />}
          className="fill-white data-[focus=true]:bg-secondary data-[hover=true]:bg-secondary"
          onPress={() => handleShare(false)}
        >
          Download Image
        </DropdownItem>
        <DropdownItem
          startContent={<X />}
          onPress={() => handleShare(true)}
          className="fill-white data-[focus=true]:bg-secondary data-[hover=true]:bg-secondary"
        >
          Share on X
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
