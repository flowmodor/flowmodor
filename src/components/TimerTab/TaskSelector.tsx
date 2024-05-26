'use client';

import { Select, SelectItem } from '@nextui-org/select';
import { Tooltip } from '@nextui-org/tooltip';
import { useEffect, useState } from 'react';
import {
  useFocusingTask,
  useIsLoadingTasks,
  useTasks,
  useTasksActions,
} from '@/stores/useTasksStore';
import { useMode, useStatus } from '@/stores/useTimerStore';

export default function TaskSelector() {
  const status = useStatus();
  const tasks = useTasks();
  const isLoadingTasks = useIsLoadingTasks();
  const focusingTask = useFocusingTask();
  const mode = useMode();
  const { focusTask, unfocusTask } = useTasksActions();

  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <Select
        isDisabled
        isLoading
        selectionMode="single"
        selectedKeys={[]}
        label="Select a task"
        size="sm"
        radius="sm"
        classNames={{
          base: 'max-w-xs',
          trigger: 'bg-secondary',
          popoverContent: 'bg-background',
        }}
      >
        <SelectItem key="skeleton" textValue="skeleton" />
      </Select>
    );
  }

  return (
    <Select
      isDisabled={
        (mode === 'focus' && status === 'running') || tasks.length === 0
      }
      isLoading={isLoadingTasks}
      selectionMode="single"
      selectedKeys={focusingTask ? [focusingTask.id.toString()] : []}
      label="Select a task"
      size="sm"
      radius="sm"
      classNames={{
        base: 'max-w-xs',
        trigger: 'bg-secondary data-[hover=true]:bg-secondary',
        popoverContent: 'bg-background',
      }}
      onChange={(e) => {
        const task = tasks.find((t) => t.id === parseInt(e.target.value, 10));

        if (e.target.value === '') {
          unfocusTask();
        }

        if (task) {
          focusTask(task);
        }
      }}
    >
      {tasks.map((task) => (
        <SelectItem
          key={task.id.toString()}
          textValue={task.name}
          classNames={{
            base: 'data-[focus=true]:!bg-secondary data-[hover=true]:!bg-secondary',
          }}
        >
          <Tooltip
            delay={1000}
            key={task.id}
            content={task.name}
            className="bg-background"
            classNames={{
              base: 'before:bg-background',
            }}
            placement="right"
            showArrow
          >
            <div>{task.name}</div>
          </Tooltip>
        </SelectItem>
      ))}
    </Select>
  );
}
