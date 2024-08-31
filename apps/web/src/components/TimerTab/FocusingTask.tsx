'use client';

import { useFocusingTask } from '@/stores/Tasks';
import { useMode, useStatus } from '@/stores/useTimerStore';

export default function FocusingTask() {
  const focusingTask = useFocusingTask();
  const status = useStatus();
  const mode = useMode();

  if (mode === 'break' || (!focusingTask && status === 'running')) {
    return <div />;
  }

  if (focusingTask) {
    return (
      <div className="max-w-xs truncate">Focusing on: {focusingTask.name}</div>
    );
  }

  return <div className="text-[#FFFFFFA0]">Click on task to focus on it</div>;
}
