'use client';

import { Enums } from '@flowmodor/types';
import { Button } from '@nextui-org/button';
import { useTransition } from 'react';
import { toast } from 'sonner';
import { connectTodoist, disconnectTodoist } from '@/actions/settings';
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
            const { error } = await disconnectTodoist();
            if (error) {
              toast.error('Failed to disconnect Todoist.');
            } else {
              toast.success('Todoist disconnected successfully!');
            }
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
