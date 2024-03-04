'use client';

import { Button } from '@nextui-org/button';
import { useTransition } from 'react';
import { connectTodoist, disconnectTodoist } from '@/actions/settings';
import { Enums } from '@/types/supabase';
import { Todoist } from '../Icons';

export default function TodoistButton({
  provider,
}: {
  provider: Enums<'provider'> | null | undefined;
}) {
  const [isPending, startTransition] = useTransition();
  return (
    <Button
      color="secondary"
      radius="sm"
      isLoading={isPending}
      onPress={() => {
        startTransition(async () => {
          if (provider === 'todoist') {
            await disconnectTodoist();
          } else {
            await connectTodoist();
          }
        });
      }}
    >
      {isPending ? null : <Todoist />}
      {provider === 'todoist' ? 'Disconnect Todoist' : 'Connect Todoist'}
    </Button>
  );
}
