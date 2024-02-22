import { Spinner } from '@nextui-org/spinner';
import useTasksStore from '@/stores/useTasksStore';
import TaskBox from './TaskBox';

export default function Tasks({ isPending }: { isPending: boolean }) {
  const { tasks } = useTasksStore((state) => state);

  return tasks.length > 0 ? (
    tasks.map((task) => (
      <div key={task.id}>
        <TaskBox task={task} />
      </div>
    ))
  ) : (
    <div className="flex h-full items-center justify-center">
      {isPending ? <Spinner color="primary" /> : 'All tasks completed!'}
    </div>
  );
}
