'use client';

import { Button } from '@nextui-org/button';
import { Input } from '@nextui-org/input';
import { useState } from 'react';
import { Plus } from '@/components/Icons';
import { useTasksActions } from '@/stores/Tasks';

export default function Toolbar() {
  const [inputValue, setInputValue] = useState<string>('');
  const { addTask } = useTasksActions();
  const isDisabled = inputValue.trim() === '';

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
        onValueChange={setInputValue}
        onKeyDown={(e) => {
          if (isDisabled) {
            return;
          }

          if (e.key === 'Enter') {
            addTask(inputValue.trim());
            setInputValue('');
          }
        }}
      />
      <Button
        type="button"
        variant="flat"
        isIconOnly
        onPress={() => {
          addTask(inputValue.trim());
          setInputValue('');
        }}
        isDisabled={isDisabled}
        className="bg-secondary fill-white"
      >
        <Plus />
      </Button>
    </>
  );
}
