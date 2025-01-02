import { createClient } from '@/utils/supabase/server';
import GoogleTasksButton from './GoogleTasksButton';
import MicrosoftToDoButton from './MicrosoftToDoButton';
import TickTickButton from './TickTickButton';
import TodoistButton from './TodoistButton';

export default async function Integrations() {
  const supabase = await createClient();
  const { data } = await supabase.from('integrations').select('*').single();

  return (
    <div className="flex flex-col items-start gap-3">
      <div className="flex items-center gap-3">
        <h2 className="text-xl font-semibold">Integrations</h2>
      </div>
      <div className="text-foreground-400 text-xs">
        Sync todo lists with third-party apps.
      </div>
      <TodoistButton
        connected={data?.todoist !== null && data?.todoist !== undefined}
      />
      <TickTickButton
        connected={data?.ticktick !== null && data?.ticktick !== undefined}
      />
      <GoogleTasksButton
        connected={
          data?.googletasks !== null && data?.googletasks !== undefined
        }
      />
      <MicrosoftToDoButton
        connected={
          data?.microsofttodo !== null && data?.microsofttodo !== undefined
        }
      />
    </div>
  );
}
