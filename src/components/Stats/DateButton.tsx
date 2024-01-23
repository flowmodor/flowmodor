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
      className="bg-secondary fill-white hover:fill-primary"
      onPress={onPress}
    >
      {children}
    </Button>
  );
}
