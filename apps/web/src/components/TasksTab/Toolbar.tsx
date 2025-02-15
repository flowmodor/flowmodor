'use client';

import { Button } from '@heroui/button';
import { Input } from '@heroui/input';
import { useState } from 'react';
import { Plus } from '@/components/Icons';
import { useTasksActions } from '@/hooks/useTasks';

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
    <div className="mt-auto flex items-center gap-3">
      <Input
        radius="sm"
        className="w-full bg-transparent text-[16px] outline-none"
        placeholder="Enter task name"
        value={inputValue}
        classNames={{
          inputWrapper:
            'h-full bg-secondary data-[hover=true]:bg-secondary data-[focus=true]:!bg-secondary',
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
        radius="sm"
        isIconOnly
        onPress={onAddTask}
        isDisabled={isDisabled}
        className="bg-secondary fill-white"
      >
        <Plus />
      </Button>
    </div>
  );
}
