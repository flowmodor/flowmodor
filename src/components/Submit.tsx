'use client';

import { Button } from '@nextui-org/button';
import { ReactNode } from 'react';
import { useFormStatus } from 'react-dom';

export default function Submit({ children }: { children: ReactNode }) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" color="primary" radius="sm" isLoading={pending}>
      {children}
    </Button>
  );
}
