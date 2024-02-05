import useTasksStore from '@/stores/useTasksStore';
import useTimerStore from '@/stores/useTimerStore';
import { Button } from '@nextui-org/button';
import { Checkbox } from '@nextui-org/checkbox';
import { UpdateOptions, toast } from 'react-toastify';

interface Props {
  task: any;
}

export default function TaskBox({ task }: Props) {
  const { isRunning, mode } = useTimerStore((state) => state);
  const { focusingTask, doCompleteTask, undoCompleteTask } = useTasksStore((state) => state);
  const toastId = "task-toast"

  const taskToast = (text: string, options?: UpdateOptions<unknown>) => {
    if (toast.isActive(toastId)){
      toast.update(toastId, { ...options, render: text || options?.render, closeButton: options?.closeButton || undefined, toastId})
    return toastId}

    let newOptions = {}

    if (options) {
      newOptions = {...options, className: options.className || undefined}
    }
    return toast(text, { ...newOptions, toastId})
  }

  const undoCompleteToast = () => taskToast(`Task ${task.name} undone.`)

  const undoComplete = async () => {undoCompleteToast();
    await undoCompleteTask(task);
  }

  const undoButton = () => (
    <Button
      onClick={() => undoComplete()} >
      UNDO
    </Button>
  )

  const completeToast = () => taskToast(`Task ${task.name} completed.`, { closeButton: undoButton })

  const doComplete = async () => {
    completeToast();
    await doCompleteTask(task)
  }

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
        onChange={async (e) => {
          if (!e.target.checked) {
            await undoComplete();
          } else {
            await doComplete();
          }
        }}
        isSelected={task.completed}
      >
        {task.name}
      </Checkbox>
    </div>
  );
}
