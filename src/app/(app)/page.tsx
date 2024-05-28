import { cookies } from 'next/headers';
import Tabs from '@/components/Tabs';
import TasksTab from '@/components/TasksTab';
import TimerTab from '@/components/TimerTab/index';
import { TasksProvider } from '@/stores/Tasks';
import { getServerClient } from '@/utils/supabase';
import getClient from '@/utils/todoist';
import { HomeProvider } from './providers';

export default async function App() {
  const supabase = getServerClient(cookies());
  const { data: tasks } = await supabase
    .from('tasks')
    .select('*')
    .is('completed', false);

  const lists = [
    {
      provider: 'Flowmodor',
      name: 'Default',
      id: 'default',
    },
  ];

  const labels = [];

  const todoist = await getClient(supabase);
  if (todoist) {
    const data = await todoist.getProjects();
    lists.push(
      {
        provider: 'Todoist',
        name: 'All',
        id: 'all',
      },
      {
        provider: 'Todoist',
        name: 'Today',
        id: 'today',
      },
    );
    data.forEach((list) => {
      lists.push({
        provider: 'Todoist',
        name: list.name,
        id: list.id,
      });
    });

    const labelsData = await todoist.getLabels();
    labels.push(...labelsData.map((label) => label.name));
  }

  return (
    <HomeProvider>
      <TasksProvider tasks={tasks ?? []} lists={lists} labels={labels}>
        <div className="flex h-full flex-col justify-center">
          <Tabs>
            <TimerTab />
            <TasksTab />
          </Tabs>
        </div>
      </TasksProvider>
    </HomeProvider>
  );
}
