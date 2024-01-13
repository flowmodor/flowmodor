import useTasksStore from '@/stores/useTasksStore';
import TaskBox from './TaskBox';

export default function Tasks() {
  const { tasks, completeTask } = useTasksStore((state) => state);

  return tasks.length > 0 ? (
    tasks.map((task) => (
      <div key={task.key}>
        <TaskBox task={task} onCompleted={() => completeTask(task.key)} />
      </div>
    ))
  ) : (
    <div className="flex h-full items-center justify-center">
      All tasks completed!
    </div>
  );
}
