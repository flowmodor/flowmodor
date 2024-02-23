import { Select, SelectItem } from '@nextui-org/select';
import useTasksStore from '@/stores/useTasksStore';
import useTimerStore from '@/stores/useTimerStore';

export default function TaskSelector() {
  const { isRunning } = useTimerStore((state) => state);
  const { tasks, focusingTask, focusTask } = useTasksStore((state) => state);

  return (
    <Select
      isDisabled={isRunning || tasks.length === 0}
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
        if (task) {
          focusTask(task);
        }
      }}
    >
      {tasks.map((task) => (
        <SelectItem
          key={task.id.toString()}
          value={task.name}
          classNames={{
            base: 'data-[focus=true]:!bg-secondary data-[hover=true]:!bg-secondary',
          }}
        >
          {task.name}
        </SelectItem>
      ))}
    </Select>
  );
}
