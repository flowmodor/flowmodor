import { Button } from '@nextui-org/button';
import { ReactNode } from 'react';

export default function DateButton({
  children,
  onPress,
}: {
  children: ReactNode;
  onPress: () => void;
}) {
  return (
    <Button
      isIconOnly
      size="sm"
      radius="full"
      className="bg-secondary fill-white"
      onPress={onPress}
    >
      {children}
    </Button>
  );
}
