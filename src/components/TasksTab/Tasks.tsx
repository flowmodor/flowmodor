import { Spinner } from '@nextui-org/spinner';
import useTasksStore from '@/stores/useTasksStore';
import TaskBox from './TaskBox';

export default function Tasks({ isLoading }: { isLoading: boolean }) {
  const { tasks } = useTasksStore((state) => state);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner color="primary" />
      </div>
    );
  }

  return tasks.length > 0 ? (
    tasks.map((task) => (
      <div key={task.id}>
        <TaskBox task={task} />
      </div>
    ))
  ) : (
    <div className="flex h-full items-center justify-center">
      All tasks completed!
    </div>
  );
}
