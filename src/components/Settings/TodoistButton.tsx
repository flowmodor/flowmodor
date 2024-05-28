'use client';

import { Button } from '@nextui-org/button';
import { useTransition } from 'react';
import { toast } from 'sonner';
import { connectTodoist, disconnectTodoist } from '@/actions/settings';
import { Enums } from '@/types/supabase';
import { Todoist } from '../Icons';

export default function TodoistButton({
  provider,
  isPro,
}: {
  provider: Enums<'provider'> | null | undefined;
  isPro: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      color="secondary"
      radius="sm"
      isLoading={isPending}
      isDisabled={!isPro}
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
