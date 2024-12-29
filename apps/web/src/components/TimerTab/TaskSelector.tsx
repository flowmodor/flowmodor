'use client';

import { Select, SelectItem } from '@nextui-org/select';
import {
  useFocusingTask,
  useTasks,
  useTasksActions,
} from '@/stores/useTasksStore';

type ParentProps = {
  open: boolean;
};

export default function TaskSelector({ open }: ParentProps) {
  const tasks = useTasks();
  const focusingTask = useFocusingTask();
  const { focusTask, unfocusTask } = useTasksActions();

  const selectItems = tasks.map((task) => (
    <SelectItem
      aria-label={task.name}
      key={task.id}
      onKeyDown={(event) => {
        if (event.key === 'Enter') {
          if (focusingTask === task) {
            unfocusTask();
          } else {
            focusTask(task);
          }
        }
      }}
      onClick={() => {
        if (focusingTask === task) {
          unfocusTask();
        } else {
          focusTask(task);
        }
      }}
      classNames={{
        base: 'data-[hover=true]:!bg-secondary data-[focus=true]:!bg-secondary',
      }}
    >
      {task.name}
    </SelectItem>
  ));

  return (
    <Select
      tabIndex={-1}
      items={selectItems}
      size="sm"
      selectionMode="single"
      aria-label="select a task"
      renderValue={() => ""}
      classNames={{
        trigger:
          'bg-transparent text-transparent border-none outline-none data-[hover=true]:bg-transparent pointer-events-none',
        popoverContent: 'bg-background',
      }}
      isOpen={open}
      selectedKeys={focusingTask ? [focusingTask.id] : []}
    >
      {selectItems}
    </Select>
  );
}
