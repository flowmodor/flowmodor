import { Task } from '@flowmodor/types';
import { Checkbox } from '@heroui/checkbox';
import { useTransition } from 'react';
import { toast } from 'sonner';
import {
  useActiveList,
  useFocusingTask,
  useTasksActions,
} from '@/hooks/useTasks';
import { useMode, useStatus } from '@/hooks/useTimer';
import { Calendar, Label, TrashCan } from '../Icons';
import Markdown from '../Markdown';

export default function TaskBox({ task }: { task: Task }) {
  const [isLoading, startTransition] = useTransition();
  const status = useStatus();
  const mode = useMode();
  const focusingTask = useFocusingTask();
  const { deleteTask, completeTask, undoCompleteTask } = useTasksActions();
  const { focusTask, unfocusTask } = useTasksActions();
  const activeList = useActiveList();
  const isFocusing = task.id === focusingTask?.id;

  return (
    <div
      className={`group relative flex min-h-[4rem] flex-shrink-0 cursor-pointer items-center border-b border-b-secondary px-4 py-4 transition-background ${isLoading && 'pointer-events-none opacity-50'} ${isFocusing && 'rounded-md bg-secondary'}`}
      onClick={() => {
        if (mode === 'focus' && status === 'running') {
          return;
        }

        if (isFocusing) {
          unfocusTask();
        } else {
          focusTask(task);
        }
      }}
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

          toast(
            <span>
              <Markdown>{task.name}</Markdown> completed
            </span>,
            {
              action: {
                label: 'Undo',
                onClick: async () => {
                  await undoCompleteTask(task, activeList);
                },
              },
            },
          );
        }}
      />
      <div className="flex select-none flex-col ">
        <Markdown>{task.name}</Markdown>
        <div className="flex flex-wrap gap-x-2 fill-[#ffffffa0] text-sm text-[#ffffffa0]">
          {task.labels?.map((label) => (
            <div key={label} className="flex gap-1">
              <Label />
              {label}
            </div>
          ))}
          {task.due ? (
            <div className="flex gap-1 fill-[#ffffffa0] text-sm text-[#ffffffa0]">
              <Calendar />
              {task.due.toDateString()}
            </div>
          ) : null}
        </div>
      </div>
      <button
        type="button"
        aria-label="Delete task"
        className="absolute right-1 hidden fill-primary group-hover:block"
        onClick={(e) => {
          startTransition(async () => {
            await deleteTask(task);
          });
          e.stopPropagation();
        }}
      >
        <TrashCan />
      </button>
    </div>
  );
}
