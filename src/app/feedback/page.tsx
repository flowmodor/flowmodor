'use client';

import { useState } from 'react';
import { Button } from '@nextui-org/button';
import { Textarea } from '@nextui-org/input';
import supabase from '@/utils/supabase';
import Menu from '@/components/Menu';

export default function Feedback() {
  const [value, setValue] = useState('');
  const isValid = value.trim().length > 0;

  const handleSend = async () => {
    if (!isValid) {
      return;
    }

    await supabase
      .from('feedback')
      .insert([
        { content: value.trim(), created_at: new Date().toISOString() },
      ]);

    setValue('');
  };

  return (
    <div>
      <Menu />
      <h1 className="mb-10 text-3xl font-semibold">Feedback</h1>
      <Textarea
        value={value}
        onValueChange={setValue}
        placeholder="Bug report, feature request, or any feedback."
        classNames={{
          base: 'w-96 mt-2',
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
