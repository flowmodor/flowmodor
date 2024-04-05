import Tabs from '@/components/Tabs';
import TasksTab from '@/components/TasksTab';
import TimerTab from '@/components/TimerTab/index';
import { HomeProvider } from './providers';

export default function App() {
  return (
    <HomeProvider>
      <div className="flex h-full flex-col justify-center">
        <Tabs>
          <TimerTab />
          <TasksTab />
        </Tabs>
      </div>
    </HomeProvider>
  );
}
