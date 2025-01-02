'use client';

import { Button } from '@nextui-org/button';
import Image from 'next/image';
import { useTransition } from 'react';
import { toast } from 'sonner';
import { connect, disconnect } from '@/actions/microsofttodo';

export default function MicrosoftToDoButton({
  connected,
}: {
  connected: boolean;
}) {
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
              toast.error('Failed to disconnect Microsoft To Do.');
            } else {
              toast.success('Microsoft To Do disconnected successfully!');
            }
          } else {
            await connect();
          }
        });
      }}
    >
      {isPending ? null : (
        <Image
          unoptimized
          alt="Microsoft To Do"
          width="24"
          height="24"
          src="/images/microsofttodo.png"
        />
      )}
      {connected ? 'Disconnect Microsoft To Do' : 'Connect Microsoft To Do'}
    </Button>
  );
}
