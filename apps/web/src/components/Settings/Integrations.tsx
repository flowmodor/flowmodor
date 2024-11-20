import { cookies } from 'next/headers';
import { getServerClient } from '@/utils/supabase';
import TodoistButton from './TodoistButton';

export default async function Integrations() {
  const supabase = getServerClient(cookies());
  const { data } = await supabase
    .from('integrations')
    .select('todoist')
    .single();

  return (
    <div className="flex flex-col gap-3 items-start">
      <div className="flex items-center gap-3">
        <h2 className="text-xl font-semibold">Integrations</h2>
      </div>
      <div className="text-xs text-foreground-400">
        Sync todo lists with third-party apps.
      </div>
      <TodoistButton
        connected={data?.todoist !== null && data?.todoist !== undefined}
      />
    </div>
  );
}
