import { toast } from 'react-toastify';
import { Button } from '@nextui-org/button';
import { Checkbox } from '@nextui-org/checkbox';
import useTasksStore from '@/stores/useTasksStore';
import useTimerStore from '@/stores/useTimerStore';
import { Tables } from '@/types/supabase';

export default function TaskBox({ task }: { task: Tables<'tasks'> }) {
  const { isRunning, mode } = useTimerStore((state) => state);
  const { focusingTask, completeTask, undoCompleteTask } = useTasksStore(
    (state) => state,
  );

  const undoButton = () => (
    <Button
      color="secondary"
      radius="sm"
      onClick={async () => {
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
          toast(`Task ${task.name} completed.`, {
            closeButton: undoButton,
            toastId: task.id,
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
