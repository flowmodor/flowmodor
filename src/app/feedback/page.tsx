'use client';

import { useState } from 'react';
import { Button } from '@nextui-org/button';
import { Textarea } from '@nextui-org/input';
import supabase from '@/utils/supabase';
import Menu from '@/components/Menu';
import { toast } from 'react-toastify';

export default function Feedback() {
  const [value, setValue] = useState('');
  const isValid = value.trim().length > 0;

  const handleSend = async () => {
    if (!isValid) {
      return;
    }

    const { error } = await supabase.from('feedback').insert([
      {
        content: value.trim(),
        created_at: new Date().toISOString(),
      },
    ]);

    if (!error) {
      toast('Feedback sent successfully!');
      setValue('');
    } else {
      toast(error.message);
    }
  };

  return (
    <div className="mt-10 w-screen px-10 sm:w-[70vw] md:w-[50vw] lg:w-[30vw]">
      <Menu />
      <h1 className="text-3xl font-semibold">Feedback</h1>
      <Textarea
        value={value}
        onValueChange={setValue}
        placeholder="Bug report, feature request, or any feedback."
        classNames={{
          base: 'w-full mt-10',
          inputWrapper:
            'bg-secondary data-[hover=true]:bg-secondary data-[focus=true]:!bg-secondary',
        }}
      />
      <div className="flex w-full justify-between py-2">
        <Button color="secondary" size="sm" radius="sm">
          Cancel
        </Button>
        <Button
          color="primary"
          size="sm"
          radius="sm"
          isDisabled={!isValid}
          onPress={handleSend}
        >
          Send
        </Button>
      </div>
    </div>
  );
}
