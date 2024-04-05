import Tabs from '@/components/Tabs';
import TasksTab from '@/components/TasksTab';
import TimerTab from '@/components/TimerTab/index';

export default function App() {
  return (
    <div className="flex h-full flex-col justify-center">
      <Tabs>
        <TimerTab />
        <TasksTab />
      </Tabs>
    </div>
  );
}
