import { Checkbox } from '@nextui-org/checkbox';
import { toast } from 'sonner';
import useTasksStore, { Task } from '@/stores/useTasksStore';
import useTimerStore from '@/stores/useTimerStore';

export default function TaskBox({ task }: { task: Task }) {
  const { isRunning, mode } = useTimerStore((state) => state);
  const { focusingTask, completeTask, undoCompleteTask } = useTasksStore(
    (state) => state,
  );

  return (
    <div className="flex min-h-[4rem] items-center border-b border-b-secondary px-4 py-1">
      <Checkbox
        isDisabled={
          isRunning && mode === 'focus' && task.id === focusingTask?.id
        }
        radius="full"
        size="lg"
        lineThrough
        classNames={{
          wrapper: 'border border-primary',
        }}
        onChange={async () => {
          await completeTask(task);

          toast(`Task ${task.name} completed.`, {
            action: {
              label: 'Undo',
              onClick: async () => {
                await undoCompleteTask(task);
              },
            },
          });
        }}
      >
        <div>
          {task.name}
          <div className="gap-x-2 flex text-[#ffffffa0] text-sm flex-wrap">
            {task.labels?.map((label) => <div key={label}>#{label}</div>)}
          </div>
        </div>
      </Checkbox>
    </div>
  );
}
