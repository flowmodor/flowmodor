import { Checkbox } from '@nextui-org/checkbox';
import { useTransition } from 'react';
import Markdown from 'react-markdown';
import { toast } from 'sonner';
import { Task, useFocusingTask, useTasksActions } from '@/stores/Tasks';
import { useMode, useStatus } from '@/stores/useTimerStore';
import { Calendar, Label, TrashCan } from '../Icons';

export default function TaskBox({ task }: { task: Task }) {
  const [isLoading, startTransition] = useTransition();
  const status = useStatus();
  const mode = useMode();
  const focusingTask = useFocusingTask();
  const { deleteTask, completeTask, undoCompleteTask } = useTasksActions();

  return (
    <div
      className={`relative group flex min-h-[4rem] items-center border-b border-b-secondary px-4 py-4 flex-shrink-0 ${
        isLoading && 'opacity-50 pointer-events-none'
      }`}
    >
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

          toast(`${task.name} completed`, {
            action: {
              label: 'Undo',
              onClick: async () => {
                await undoCompleteTask(task);
              },
            },
          });
        }}
      />
      <div className="flex flex-col">
        <Markdown className="prose prose-invert prose-p:text-white prose-li:text-white">
          {task.name}
        </Markdown>
        <div className="gap-x-2 flex text-[#ffffffa0] fill-[#ffffffa0] text-sm flex-wrap">
          {task.labels?.map((label) => (
            <div key={label} className="flex gap-1">
              <Label />
              {label}
            </div>
          ))}
          {task.due ? (
            <div className="flex text-sm text-[#ffffffa0] fill-[#ffffffa0] gap-1">
              <Calendar />
              {task.due.toDateString()}
            </div>
          ) : null}
        </div>
      </div>
      <button
        type="button"
        aria-label="Delete task"
        className="absolute right-0 fill-primary group-hover:block hidden"
        onClick={() => {
          startTransition(async () => {
            await deleteTask(task);
          });
        }}
      >
        <TrashCan />
      </button>
    </div>
  );
}
