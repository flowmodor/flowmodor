import { Button } from '@nextui-org/button';
import Link from 'next/link';
import { Enums } from '@/types/supabase';
import { Todoist } from '../Icons';

export default function Integrations({
  provider,
}: {
  provider: Enums<'provider'> | null | undefined;
}) {
  return (
    <div className="flex flex-col gap-3 items-start">
      <h2 className="text-xl font-semibold">Integrations</h2>
      <Button
        as={Link}
        color="secondary"
        radius="sm"
        href="/auth/todoist/authorize"
      >
        <Todoist />{' '}
        {provider === 'todoist' ? 'Disconnect Todoist' : 'Connect Todoist'}
      </Button>
    </div>
  );
}
