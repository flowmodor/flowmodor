import { Select, SelectItem } from '@nextui-org/select';
import { Tooltip } from '@nextui-org/tooltip';
import useTasksStore from '@/stores/useTasksStore';
import useTimerStore from '@/stores/useTimerStore';

export default function TaskSelector() {
  const { isRunning } = useTimerStore((state) => state);
  const { tasks, isLoadingTasks, focusingTask, focusTask, unfocusTask } =
    useTasksStore((state) => state);

  return (
    <Select
      isDisabled={isRunning || tasks.length === 0}
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
