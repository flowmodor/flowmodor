/* eslint-disable react/jsx-no-useless-fragment */
import useTasksStore from '@/stores/useTasksStore';
import useTimerStore from '@/stores/useTimerStore';
import { Task } from '@/types';
import { Checkbox } from '@nextui-org/react';

interface Props {
  task: Task;
  onCompleted: (task: Task) => void;
}

export default function TaskBox({ task, onCompleted }: Props) {
  const { isRunning, mode } = useTimerStore((state) => state);
  const { focusingTask } = useTasksStore((state) => state);

  return (
    <div className="flex h-16 shrink-0 items-center border-b border-b-secondary px-4">
      <Checkbox
        isDisabled={isRunning && mode === 'focus' && task.key === focusingTask}
        disableAnimation
        radius="full"
        size="lg"
        icon={<></>}
        lineThrough
        classNames={{
          wrapper: 'border border-primary',
        }}
        onChange={() => onCompleted(task)}
      >
        {task.name}
      </Checkbox>
    </div>
  );
}
