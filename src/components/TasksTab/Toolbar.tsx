import { useState } from 'react';
import { Button } from '@nextui-org/button';
import { Plus } from '@/components/Icons';
import supabase from '@/utils/supabase';
import { toast } from 'react-toastify';

export default function Toolbar() {
  const [inputValue, setInputValue] = useState<string>('');

  const onAddTask = async (name: string | undefined) => {
    if (!name) {
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { error } = await supabase
      .from('tasks')
      .insert([{ user_id: user?.id, name }]);

    if (error) {
      toast(error.message);
    }
  };

  return (
    <>
      <input
        className="w-full bg-transparent pr-5 text-[16px] outline-none"
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
