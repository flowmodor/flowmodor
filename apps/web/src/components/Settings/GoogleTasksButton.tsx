'use client';

import { Button } from '@nextui-org/button';
import Image from 'next/image';
import { useTransition } from 'react';
import { toast } from 'sonner';
import { connect, disconnect } from '@/actions/googletasks';

export default function GoogleTasksButton({
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
              toast.error('Failed to disconnect Google Tasks.');
            } else {
              toast.success('Google Tasks disconnected successfully!');
            }
          } else {
            await connect();
          }
        });
      }}
    >
      {isPending ? null : (
        <Image
          alt="Google Tasks"
          width="24"
          height="24"
          src="/images/googletasks.png"
        />
      )}
      {connected ? 'Disconnect Google Tasks' : 'Connect Google Tasks'}
    </Button>
  );
}
