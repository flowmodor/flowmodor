'use client';

import { Button } from '@nextui-org/button';
import { Chip } from '@nextui-org/chip';
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
      <div className="flex items-center gap-3">
        <h2 className="text-xl font-semibold">Integrations</h2>
        <Chip color="primary" size="sm" radius="sm">
          Beta
        </Chip>
      </div>
      <div className="text-sm color-secondary">
        Fetch tasks from thirdparty apps
      </div>
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
