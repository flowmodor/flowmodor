/* eslint-disable react/jsx-no-useless-fragment */
import { Task } from '@/types';
import { Checkbox } from '@nextui-org/react';

interface Props {
  task: Task;
  onCompleted: (task: Task) => void;
}

export default function TaskBox({ task, onCompleted }: Props) {
  return (
    <div className="flex h-16 shrink-0 items-center border-b border-b-secondary px-4">
      <Checkbox
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
