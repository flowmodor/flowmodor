import { Spinner } from '@nextui-org/spinner';
import useTasksStore from '@/stores/useTasksStore';
import TaskBox from './TaskBox';

export default function Tasks() {
  const { tasks, isLoadingTasks } = useTasksStore((state) => state);

  if (isLoadingTasks) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner color="primary" />
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        All tasks completed!
      </div>
    );
  }

  return (
    <div className="overflow-y-scroll scrollbar-hide">
      {tasks.map((task) => (
        <TaskBox task={task} key={task.id} />
      ))}
    </div>
  );
}
