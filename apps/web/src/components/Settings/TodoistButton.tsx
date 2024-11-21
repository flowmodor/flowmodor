'use client';

import { Button } from '@nextui-org/button';
import Image from 'next/image';
import { useTransition } from 'react';
import { toast } from 'sonner';
import { connect, disconnect } from '@/actions/todoist';

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
            const { error } = await disconnect();
            if (error) {
              toast.error('Failed to disconnect Todoist.');
            } else {
              toast.success('Todoist disconnected successfully!');
            }
          } else {
            await connect();
          }
        });
      }}
    >
      {isPending ? null : (
        <Image alt="Todoist" width="24" height="24" src="/images/todoist.png" />
      )}
      {connected ? 'Disconnect Todoist' : 'Connect Todoist'}
    </Button>
  );
}
