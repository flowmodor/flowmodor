import { useState } from 'react';
import { Button } from '@nextui-org/button';
import { Plus } from '@/components/Icons';
import useTasksStore from '@/stores/useTasksStore';

export default function Toolbar() {
  const { tasks, addTask } = useTasksStore((state) => state);
  const [inputValue, setInputValue] = useState<string>('');

  const onAddTask = (name: string | undefined) => {
    if (!name) {
      return;
    }

    addTask({
      key: tasks.length + 1,
      name,
    });
  };

  return (
    <>
      <input
        className="w-full bg-transparent pr-5 outline-none"
        placeholder="Enter task name"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={(e) => {
          if (inputValue.trim() === '') {
            return;
          }

          if (e.key === 'Enter') {
            onAddTask(inputValue.trim());
            setInputValue('');
          }
        }}
      />
      <Button
        type="button"
        variant="flat"
        isIconOnly
        onClick={() => {
          if (inputValue.trim() === '') {
            return;
          }
          onAddTask(inputValue.trim());
          setInputValue('');
        }}
        className={`bg-secondary transition ${
          inputValue.trim() !== ''
            ? 'cursor-pointer fill-primary'
            : 'cursor-auto fill-white'
        }`}
      >
        <Plus />
      </Button>
    </>
  );
}
