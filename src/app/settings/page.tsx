'use client';

import Menu from '@/components/Menu';
import useUpdateSettings from '@/hooks/useUpdateSettings';
import supabase from '@/utils/supabase';
import { Button } from '@nextui-org/button';
import { Input } from '@nextui-org/input';
import { useEffect, useState } from 'react';

export default function Settings() {
  const [breakRatio, setBreakRatio] = useState(0);
  const { isLoading, updateSettings } = useUpdateSettings();

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('settings')
        .select('break_ratio')
        .single();
      if (data?.break_ratio) {
        setBreakRatio(data.break_ratio);
      }
    })();
  }, []);

  return (
    <>
      <Menu />
      <div className="mt-20 w-screen px-10 sm:w-[70vw] md:w-[50vw] lg:w-[40vw]">
        <h1 className="text-3xl font-semibold">Settings</h1>
        <Input
          label="Break ratio"
          labelPlacement="outside"
          placeholder="5"
          variant="bordered"
          description="Your break time will be your focus time divided by this number."
          radius="sm"
          type="number"
          value={breakRatio.toString()}
          onValueChange={(value) =>
            setBreakRatio(value === '' ? 0 : parseInt(value, 10))
          }
          classNames={{
            input: 'text-[16px]',
            inputWrapper:
              'mt-10 border-secondary data-[hover=true]:border-secondary data-[focus=true]:!border-primary',
          }}
        />
        <div className="flex">
          <Button
            color="primary"
            radius="sm"
            className="ml-auto mt-2"
            isDisabled={breakRatio <= 0}
            isLoading={isLoading}
            onPress={() => updateSettings(breakRatio)}
          >
            Save
          </Button>
        </div>
      </div>
    </>
  );
}
