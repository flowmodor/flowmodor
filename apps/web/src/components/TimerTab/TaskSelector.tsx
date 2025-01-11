import { Select, SelectItem } from '@nextui-org/select';
import { Tooltip } from '@nextui-org/tooltip';
import { useFocusingTask, useTasks, useTasksActions } from '@/hooks/useTasks';
import { useMode, useStatus } from '@/hooks/useTimer';
import { RightArrow } from '../Icons';
import Markdown from '../Markdown';

export default function TaskSelector() {
  const tasks = useTasks();
  const focusingTask = useFocusingTask();
  const mode = useMode();
  const status = useStatus();
  const { focusTask, unfocusTask } = useTasksActions();

  if (mode === 'break' || (!focusingTask && status === 'running')) {
    return null;
  }

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
      onPress={() => {
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
      <Markdown>{task.name}</Markdown>
    </SelectItem>
  ));

  return (
    <Select
      items={selectItems}
      size="sm"
      selectionMode="single"
      aria-label="select a task"
      placeholder="Select a task"
      disableSelectorIconRotation
      isDisabled={status === 'running'}
      selectedKeys={focusingTask ? [focusingTask.id] : []}
      selectorIcon={<RightArrow fill={focusingTask ? 'white' : '#FFFFFFA0'} />}
      renderValue={(items) => (
        <Tooltip
          showArrow
          color="secondary"
          placement="bottom"
          content={items[0].rendered}
          aria-label="tooltip"
          delay={500}
        >
          <div className="max-w-[9rem] truncate">{items[0].rendered}</div>
        </Tooltip>
      )}
      classNames={{
        trigger:
          'bg-transparent border-none outline-none data-[hover=true]:bg-transparent flex-row justify-center items-center gap-1 h-min min-h-0',
        popoverContent: 'bg-background',
        innerWrapper: 'w-min h-min',
        value: 'text-center w-min',
        selectorIcon: 'static',
        base: 'w-[22rem]',
      }}
    >
      {selectItems}
    </Select>
  );
}
