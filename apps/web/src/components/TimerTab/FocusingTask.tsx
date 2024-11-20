'use client';

import { Tooltip } from '@nextui-org/tooltip';
import { useFocusingTask } from '@/stores/useTasksStore';
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
      <Tooltip
        showArrow
        color="secondary"
        placement="bottom"
        content={focusingTask.name}
      >
        <div className="max-w-[10rem] truncate">{focusingTask.name}</div>
      </Tooltip>
    );
  }

  return <div className="text-[#FFFFFFA0]">Click a task to focus on</div>;
}
