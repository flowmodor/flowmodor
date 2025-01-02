'use client';

import { Spinner } from '@nextui-org/spinner';
import { useIsLoadingTasks, useTasks } from '@/stores/useTasksStore';
import TaskBox from './TaskBox';

export default function Tasks() {
  const tasks = useTasks();
  const isLoadingTasks = useIsLoadingTasks();

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
    <div className="scrollbar-hide overflow-y-scroll">
      {tasks.map((task) => (
        <TaskBox task={task} key={task.id} />
      ))}
    </div>
  );
}
