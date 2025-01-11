import {
  connect as connectGoogleTasks,
  disconnect as disconnectGoogleTasks,
} from '@/actions/googletasks';
import {
  connect as connectMicrosoftToDo,
  disconnect as disconnectMicrosoftToDo,
} from '@/actions/microsofttodo';
import {
  connect as connectTickTick,
  disconnect as disconnectTickTick,
} from '@/actions/ticktick';
import {
  connect as connectTodoist,
  disconnect as disconnectTodoist,
} from '@/actions/todoist';
import { createClient } from '@/utils/supabase/server';
import IntegrationButton from './IntegrationButton';

export default async function Integrations() {
  const supabase = await createClient();
  const { data } = await supabase.from('integrations').select('*').single();

  const integrations = [
    {
      name: 'Todoist',
      imageSrc: '/images/todoist.png',
      connected: data?.todoist !== null && data?.todoist !== undefined,
      connectAction: connectTodoist,
      disconnectAction: disconnectTodoist,
    },
    {
      name: 'TickTick',
      imageSrc: '/images/ticktick.png',
      connected: data?.ticktick !== null && data?.ticktick !== undefined,
      connectAction: connectTickTick,
      disconnectAction: disconnectTickTick,
    },
    {
      name: 'Google Tasks',
      imageSrc: '/images/googletasks.png',
      connected: data?.googletasks !== null && data?.googletasks !== undefined,
      connectAction: connectGoogleTasks,
      disconnectAction: disconnectGoogleTasks,
    },
    {
      name: 'Microsoft To Do',
      imageSrc: '/images/microsofttodo.png',
      connected:
        data?.microsofttodo !== null && data?.microsofttodo !== undefined,
      connectAction: connectMicrosoftToDo,
      disconnectAction: disconnectMicrosoftToDo,
    },
  ];

  return (
    <div className="flex flex-col items-start gap-3">
      <div className="flex items-center gap-3">
        <h2 className="text-xl font-semibold">Integrations</h2>
      </div>
      <div className="text-xs text-foreground-400">
        Sync todo lists with third-party apps.
      </div>
      {integrations.map((integration) => (
        <IntegrationButton key={integration.name} {...integration} />
      ))}
    </div>
  );
}
