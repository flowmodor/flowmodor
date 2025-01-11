'use client';

import { useIsLoadingTasks, useTasks } from '@/hooks/useTasks';
import SkeletonTaskBox from './SkeletonTaskBox';
import TaskBox from './TaskBox';

export default function Tasks() {
  const tasks = useTasks();
  const isLoadingTasks = useIsLoadingTasks();

  if (isLoadingTasks) {
    return (
      <div className="overflow-y-scroll scrollbar-hide">
        <SkeletonTaskBox />
        <SkeletonTaskBox />
        <SkeletonTaskBox />
        <SkeletonTaskBox />
        <SkeletonTaskBox />
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
