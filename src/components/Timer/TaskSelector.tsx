import { Select, SelectItem } from '@nextui-org/select';
import useTimerStore from '@/stores/useTimerStore';
import useTasksStore from '@/stores/useTasksStore';

export default function TaskSelector() {
  const { isRunning } = useTimerStore((state) => state);
  const { tasks, focusingTask, focusTask } = useTasksStore((state) => state);

  return (
    <Select
      isDisabled={isRunning || tasks.length === 0}
      selectionMode="single"
      selectedKeys={focusingTask ? [focusingTask.toString()] : []}
      label="Select a task"
      size="sm"
      radius="sm"
      classNames={{
        base: 'w-64',
        trigger: 'bg-secondary data-[hover=true]:bg-secondary',
        popoverContent: 'bg-[#131221] data-[hover=true]:bg-white',
        listboxWrapper: 'data-[focus=true]:bg-white',
      }}
      onChange={(e) => {
        focusTask(parseInt(e.target.value, 10));
      }}
    >
      {tasks.map((task) => (
        <SelectItem key={task.key} value={task.name}>
          {task.name}
        </SelectItem>
      ))}
    </Select>
  );
}
