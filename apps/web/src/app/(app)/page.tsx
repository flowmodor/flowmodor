import TabsWrapper from '@/components/Tabs';
import TasksTab from '@/components/TasksTab';
import TimerTab from '@/components/TimerTab/index';
import { HomeProvider } from './providers';

export default async function App() {
  return (
    <HomeProvider>
      <div className="flex h-full items-center justify-center">
        <TabsWrapper>
          <TimerTab />
          <TasksTab />
        </TabsWrapper>
      </div>
    </HomeProvider>
  );
}
