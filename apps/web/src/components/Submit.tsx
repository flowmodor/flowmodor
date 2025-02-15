'use client';

import { Button } from '@heroui/button';
import { ReactNode } from 'react';
import { useFormStatus } from 'react-dom';

export default function Submit({
  children,
  isDisabled = false,
}: {
  children: ReactNode;
  isDisabled?: boolean;
}) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      color="primary"
      radius="sm"
      isDisabled={isDisabled}
      isLoading={pending}
    >
      {children}
    </Button>
  );
}
