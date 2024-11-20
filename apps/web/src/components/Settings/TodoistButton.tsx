'use client';

import { Button } from '@nextui-org/button';
import { useTransition } from 'react';
import { toast } from 'sonner';
import { connectTodoist, disconnectTodoist } from '@/actions/settings';
import { Todoist } from '../Icons';

export default function TodoistButton({ connected }: { connected: Boolean }) {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      color="secondary"
      radius="sm"
      isLoading={isPending}
      onPress={() => {
        startTransition(async () => {
          if (connected) {
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
      {connected ? 'Disconnect Todoist' : 'Connect Todoist'}
    </Button>
  );
}
