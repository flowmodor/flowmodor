import { Button } from '@nextui-org/button';
import { ReactNode } from 'react';

export default function DateButton({
  children,
  onPress,
  ariaLabel,
  isDisabled = false,
}: {
  children: ReactNode;
  onPress: () => void;
  ariaLabel: string;
  isDisabled?: boolean;
}) {
  return (
    <Button
      isIconOnly
      size="sm"
      radius="full"
      disableRipple
      className="bg-secondary fill-white"
      onPress={onPress}
      isDisabled={isDisabled}
      aria-label={ariaLabel}
    >
      {children}
    </Button>
  );
}
