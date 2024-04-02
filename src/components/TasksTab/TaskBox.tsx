import { Checkbox } from '@nextui-org/checkbox';
import { toast } from 'sonner';
import { Task, useFocusingTask, useTasksActions } from '@/stores/useTasksStore';
import useTimerStore from '@/stores/useTimerStore';

export default function TaskBox({ task }: { task: Task }) {
  const { status, mode } = useTimerStore((state) => state);
  const focusingTask = useFocusingTask();
  const { completeTask, undoCompleteTask } = useTasksActions();

  return (
    <div className="flex min-h-[4rem] items-center border-b border-b-secondary px-4 py-4 flex-shrink-0">
      <Checkbox
        isDisabled={
          status === 'running' &&
          mode === 'focus' &&
          task.id === focusingTask?.id
        }
        radius="full"
        size="lg"
        lineThrough
        classNames={{
          wrapper: 'border border-primary flex-shrink-0 mr-4',
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
