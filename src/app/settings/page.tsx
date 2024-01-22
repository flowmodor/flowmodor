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
    <div className="mt-32 flex flex-col gap-10">
      <Menu />
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
            'border-secondary data-[hover=true]:border-secondary data-[focus=true]:!border-primary',
        }}
      />
      <Button
        color="primary"
        radius="sm"
        className="self-end"
        isDisabled={breakRatio <= 0}
        isLoading={isLoading}
        onPress={() => updateSettings(breakRatio)}
      >
        Save
      </Button>
    </div>
  );
}
