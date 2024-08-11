import { cookies } from 'next/headers';
import Tabs from '@/components/Tabs';
import TasksTab from '@/components/TasksTab';
import TimerTab from '@/components/TimerTab/index';
import { TasksProvider } from '@/stores/Tasks';
import { getServerClient } from '@/utils/supabase';
import { HomeProvider } from './providers';

export default async function App() {
  const supabase = getServerClient(cookies());
  const { data: tasks } = await supabase
    .from('tasks')
    .select('*')
    .is('completed', false);

  return (
    <TasksProvider tasks={tasks ?? []}>
      <HomeProvider>
        <div className="flex h-full flex-col justify-center">
          <Tabs>
            <TimerTab />
            <TasksTab />
          </Tabs>
        </div>
      </HomeProvider>
    </TasksProvider>
  );
}
