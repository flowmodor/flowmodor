'use client';

import { Button } from '@nextui-org/button';
import Image from 'next/image';
import { useTransition } from 'react';
import { toast } from 'sonner';
import { connect, disconnect } from '@/actions/ticktick';

export default function TickTickButton({ connected }: { connected: Boolean }) {
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
              toast.error('Failed to disconnect TickTick.');
            } else {
              toast.success('TickTick disconnected successfully!');
            }
          } else {
            await connect();
          }
        });
      }}
    >
      {isPending ? null : (
        <Image
          alt="TickTick"
          width="24"
          height="24"
          src="/images/ticktick.png"
        />
      )}
      {connected ? 'Disconnect TickTick' : 'Connect TickTick'}
    </Button>
  );
}
