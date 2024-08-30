'use client';

import { useFocusingTask } from '@/stores/Tasks';

export default function FocusingTask() {
  const focusingTask = useFocusingTask();

  if (focusingTask) {
    return (
      <div className="max-w-xs truncate">Focusing on: {focusingTask.name}</div>
    );
  }

  return <div className="text-[#FFFFFFA0]">Click on task to focus on it</div>;
}
