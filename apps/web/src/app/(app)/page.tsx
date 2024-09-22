import { cookies } from 'next/headers';
import TabsWrapper from '@/components/Tabs';
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
        <div className="flex h-full items-center justify-center">
          <TabsWrapper>
            <TimerTab />
            <TasksTab />
          </TabsWrapper>
        </div>
      </HomeProvider>
    </TasksProvider>
  );
}
