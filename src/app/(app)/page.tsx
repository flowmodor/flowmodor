import { cookies } from 'next/headers';
import Tabs from '@/components/Tabs';
import TasksTab from '@/components/TasksTab';
import TimerTab from '@/components/TimerTab/index';
import { TasksProvider } from '@/stores/Tasks';
import { getServerClient } from '@/utils/supabase';
import { HomeProvider, TourCustomProvider } from './providers';

export default async function App() {
  const supabase = getServerClient(cookies());
  const { data: tasks } = await supabase
    .from('tasks')
    .select('*')
    .is('completed', false);

  const { data, error } = await supabase
    .from('profiles')
    .select('is_new')
    .single();

  const children = (
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

  const isNewUser = !error && data.is_new;
  if (isNewUser) {
    return <TourCustomProvider>{children}</TourCustomProvider>;
  }

  return children;
}
