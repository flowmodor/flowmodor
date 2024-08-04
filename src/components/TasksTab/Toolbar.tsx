'use client';

import { Button } from '@nextui-org/button';
import { Input } from '@nextui-org/input';
import { useState } from 'react';
import { Plus } from '@/components/Icons';
import { useTasksActions } from '@/stores/Tasks';

export default function Toolbar() {
  const [inputValue, setInputValue] = useState<string>('');
  const [isComposing, setIsComposing] = useState(false);
  const { addTask } = useTasksActions();
  const isDisabled = inputValue.trim() === '';

  const onAddTask = () => {
    addTask(inputValue.trim());
    setInputValue('');
  };

  return (
    <>
      <Input
        className="w-full bg-transparent pr-5 text-[16px] outline-none"
        placeholder="Enter task name"
        value={inputValue}
        classNames={{
          inputWrapper:
            'h-full bg-transparent data-[hover=true]:bg-transparent data-[focus=true]:!bg-transparent',
          input: 'text-[16px]',
        }}
        onCompositionStart={() => setIsComposing(true)}
        onCompositionEnd={() => setIsComposing(false)}
        onValueChange={setInputValue}
        onKeyDown={(e) => {
          if (isDisabled || isComposing) {
            return;
          }

          if (e.key === 'Enter') {
            onAddTask();
          }
        }}
      />
      <Button
        type="button"
        variant="flat"
        isIconOnly
        onPress={onAddTask}
        isDisabled={isDisabled}
        className="bg-secondary fill-white"
      >
        <Plus />
      </Button>
    </>
  );
}
