import { Chip } from '@nextui-org/chip';
import { Link } from '@nextui-org/link';
import { Tooltip } from '@nextui-org/tooltip';
import { ReactNode } from 'react';

export default function TooltipWrapper({
  children,
  isPro,
}: {
  children: ReactNode;
  isPro: boolean;
}) {
  if (isPro) {
    return children;
  }

  return (
    <Tooltip
      radius="sm"
      className="bg-midground"
      content={
        <div className="flex gap-3">
          Upgrade to
          <Chip as={Link} size="sm" radius="sm" color="primary" href="/plans">
            Pro
          </Chip>
          to see more stats
        </div>
      }
    >
      <div>{children}</div>
    </Tooltip>
  );
}
