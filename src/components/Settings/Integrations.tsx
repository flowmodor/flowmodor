import { cookies } from 'next/headers';
import { getServerClient } from '@/utils/supabase';
import TodoistButton from './TodoistButton';

export default async function Integrations({ isPro }: { isPro: boolean }) {
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
      </div>
      <div className="text-sm color-secondary">
        Sync tasks with third-party apps
      </div>
      <TodoistButton provider={provider} isPro={isPro} />
    </div>
  );
}
