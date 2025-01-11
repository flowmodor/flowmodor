'use client';

import { Button } from '@nextui-org/button';
import Image from 'next/image';
import { useTransition } from 'react';
import { toast } from 'sonner';

interface IntegrationButtonProps {
  name: string;
  imageSrc: string;
  connected: boolean;
  connectAction: () => Promise<void>;
  disconnectAction: () => Promise<{ error: { message: string } | null }>;
}

export default function IntegrationButton({
  name,
  imageSrc,
  connected,
  connectAction,
  disconnectAction,
}: IntegrationButtonProps) {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      color="secondary"
      radius="sm"
      isLoading={isPending}
      onPress={() => {
        startTransition(async () => {
          if (connected) {
            const result = await disconnectAction();
            if (result.error) {
              toast.error(`Failed to disconnect ${name}.`);
            } else {
              toast.success(`${name} disconnected successfully!`);
            }
          } else {
            await connectAction();
          }
        });
      }}
    >
      {isPending ? null : (
        <Image alt={name} width="24" height="24" src={imageSrc} />
      )}
      {connected ? `Disconnect ${name}` : `Connect ${name}`}
    </Button>
  );
}
