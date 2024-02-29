'use client';

import { Button } from '@nextui-org/button';
import { Textarea } from '@nextui-org/input';
import { Link } from '@nextui-org/link';
import { useState } from 'react';
import { toast } from 'react-toastify';
import GoHome from '@/components/GoHome';
import Menu from '@/components/Menu';
import supabase from '@/utils/supabase';

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
    <>
      <Menu />
      <div className="mt-20 w-screen px-10 sm:w-[70vw] md:w-[50vw] lg:w-[40vw]">
        <h1 className="flex items-center gap-3 text-3xl font-semibold">
          <GoHome />
          Feedback
        </h1>
        <div className="mt-10 text-sm">
          If you have GitHub account, please use{' '}
          <Link
            href="https://github.com/flowmodor/flowmodor/issues"
            className="text-sm"
          >
            Issue tab
          </Link>{' '}
          for bug report, and{' '}
          <Link
            href="https://github.com/flowmodor/flowmodor/discussions/categories/feature-request"
            className="text-sm"
          >
            Discussion tab
          </Link>{' '}
          for feature request.
        </div>
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
        <div className="mt-2 flex">
          <Button
            color="primary"
            size="sm"
            radius="sm"
            className="ml-auto"
            isDisabled={!isValid}
            onPress={handleSend}
          >
            Send
          </Button>
        </div>
      </div>
    </>
  );
}
