import useTasksStore from '@/stores/useTasksStore';
import useTimerStore from '@/stores/useTimerStore';
import { Button } from '@nextui-org/button';
import { Checkbox } from '@nextui-org/checkbox';
import { UpdateOptions, toast } from 'react-toastify';

interface Props {
  task: any;
}

export default function TaskBox({ task }: Props) {
  const { isRunning, mode } = useTimerStore((state) => state);
  const { focusingTask, completeTask, undoCompleteTask } = useTasksStore(
    (state) => state,
  );
  const toastId = 'task-toast';

  const taskToast = (text: string, options?: UpdateOptions<unknown>) => {
    if (toast.isActive(toastId)) {
      toast.dismiss(toastId);
      return toastId;
    }

    let newOptions = {};

    if (options) {
      newOptions = { ...options, className: options.className || undefined };
    }
    return toast(text, { ...newOptions, toastId });
  };

  const undoButton = () => (
    <Button
      onClick={async () => {
        taskToast(`Task ${task.name} undone.`);
        await undoCompleteTask(task);
      }}
    >
      Undo
    </Button>
  );

  return (
    <div className="flex min-h-[4rem] items-center border-b border-b-secondary px-4">
      <Checkbox
        isDisabled={isRunning && mode === 'focus' && task.id === focusingTask}
        radius="full"
        size="lg"
        lineThrough
        classNames={{
          wrapper: 'border border-primary',
        }}
        onChange={async () => {
          taskToast(`Task ${task.name} completed.`, {
            closeButton: undoButton,
          });
          await completeTask(task);
        }}
        isSelected={task.completed}
      >
        {task.name}
      </Checkbox>
    </div>
  );
}
