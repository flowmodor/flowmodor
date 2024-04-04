import { Chip } from '@nextui-org/chip';
import { cookies } from 'next/headers';
import { getServerClient } from '@/utils/supabase';
import TodoistButton from './TodoistButton';

export default async function Integrations() {
  const supabase = getServerClient(cookies());
  const { data } = await supabase
    .from('integrations')
    .select('provider')
    .single();

  const provider = data?.provider;

  return (
    <div className="flex flex-col gap-3 items-start">
      <div className="flex items-center gap-3">
        <h2 className="text-xl font-semibold">Integrations</h2>
        <Chip color="primary" size="sm" radius="sm">
          Beta (ends at April 10)
        </Chip>
      </div>
      <div className="text-sm color-secondary">
        Sync tasks with third-party apps
      </div>
      <TodoistButton provider={provider} />
    </div>
  );
}
