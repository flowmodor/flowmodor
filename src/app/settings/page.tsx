'use client';

import GoHome from '@/components/GoHome';
import Menu from '@/components/Menu';
import useIsPro from '@/hooks/useIsPro';
import useUpdateSettings from '@/hooks/useUpdateSettings';
import supabase from '@/utils/supabase';
import { Button } from '@nextui-org/button';
import { Input } from '@nextui-org/input';
import { Link } from '@nextui-org/link';
import { useEffect, useState } from 'react';

export default function Settings() {
  const [breakRatio, setBreakRatio] = useState(0);
  const { isLoading, updateSettings } = useUpdateSettings();
  const isPro = useIsPro();

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
        <h1 className="mb-10 flex items-center gap-3 text-3xl font-semibold">
          <GoHome />
          Settings
        </h1>
        {!isPro ? (
          <div className="mb-10">
            <Link underline="always" href="/plans">
              Upgrade to Pro
            </Link>{' '}
            to set custom break ratio.
          </div>
        ) : null}
        <Input
          isDisabled={!isPro}
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
        <div className="flex">
          <Button
            color="primary"
            radius="sm"
            className="ml-auto mt-2"
            isDisabled={!isPro || breakRatio <= 0}
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
