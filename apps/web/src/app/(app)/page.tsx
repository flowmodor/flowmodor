import { Link } from '@nextui-org/link';
import TabsWrapper from '@/components/Tabs';
import TasksTab from '@/components/TasksTab';
import TimerTab from '@/components/TimerTab/index';
import { createClient } from '@/utils/supabase/server';
import { HomeProvider } from './providers';

export default async function App() {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <HomeProvider>
      <div className="flex flex-col gap-5 h-full items-center justify-center">
        {!session && (
          <div className="text-sm">
            <Link href="/signin" underline="always" className="text-sm">
              Sign in
            </Link>{' '}
            to save focus history and tasks.
          </div>
        )}
        <TabsWrapper>
          <TimerTab />
          <TasksTab />
        </TabsWrapper>
      </div>
    </HomeProvider>
  );
}
