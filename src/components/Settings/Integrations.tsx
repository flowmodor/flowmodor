'use client';

import { Button } from '@nextui-org/button';
import { useTransition } from 'react';
import { connectTodoist, disconnectTodoist } from '@/app/settings/actions';
import { Enums } from '@/types/supabase';
import { Todoist } from '../Icons';

export default function Integrations({
  provider,
}: {
  provider: Enums<'provider'> | null | undefined;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex flex-col gap-3 items-start">
      <h2 className="text-xl font-semibold">Integrations</h2>
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
    </div>
  );
}
