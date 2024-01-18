import useTasksStore from '@/stores/useTasksStore';
import useTimerStore from '@/stores/useTimerStore';
import supabase from '@/utils/supabase';
import { Checkbox } from '@nextui-org/checkbox';

interface Props {
  task: any;
}

export default function TaskBox({ task }: Props) {
  const { isRunning, mode } = useTimerStore((state) => state);
  const { focusingTask } = useTasksStore((state) => state);

  return (
    <div className="flex min-h-[4rem] items-center border-b border-b-secondary px-4">
      <Checkbox
        isDisabled={isRunning && mode === 'focus' && task.id === focusingTask}
        radius="full"
        size="lg"
        lineThrough
        classNames={{
          wrapper: 'border border-primary',
        }}
        onChange={async () => {
          await supabase
            .from('tasks')
            .update({ completed: true })
            .eq('id', task.id);
        }}
      >
        {task.name}
      </Checkbox>
    </div>
  );
}
