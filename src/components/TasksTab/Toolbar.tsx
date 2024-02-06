import { Button } from '@nextui-org/button';
import { Input } from '@nextui-org/input';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { Plus } from '@/components/Icons';
import supabase from '@/utils/supabase';

export default function Toolbar() {
  const [inputValue, setInputValue] = useState<string>('');
  const isDisabled = inputValue.trim() === '';

  const onAddTask = async (name: string | undefined) => {
    if (!name) {
      return;
    }

    const { error } = await supabase.from('tasks').insert([{ name }]);

    if (error) {
      toast(error.message);
    }
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
        onValueChange={setInputValue}
        onKeyDown={(e) => {
          if (isDisabled) {
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
        onPress={() => {
          onAddTask(inputValue.trim());
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
