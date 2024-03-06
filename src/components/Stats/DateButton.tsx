import { Button } from '@nextui-org/button';
import { ReactNode } from 'react';

export default function DateButton({
  children,
  onPress,
  isDisabled,
}: {
  children: ReactNode;
  onPress: () => void;
  isDisabled?: boolean;
}) {
  return (
    <Button
      isIconOnly
      size="sm"
      radius="full"
      className="bg-secondary fill-white"
      onPress={onPress}
      isDisabled={isDisabled}
    >
      {children}
    </Button>
  );
}

DateButton.defaultProps = {
  isDisabled: false,
};
