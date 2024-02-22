'use client';

import { Button } from '@nextui-org/button';
import { Input } from '@nextui-org/input';
import Link from 'next/link';
import { useState } from 'react';
import useUpdateSettings from '@/hooks/useUpdateSettings';
import { Todoist } from '../Icons';

export default function Options({
  isPro,
  defaultBreakRatio,
}: {
  isPro: boolean;
  defaultBreakRatio: number;
}) {
  const [breakRatio, setBreakRatio] = useState(defaultBreakRatio);
  const { isLoading, updateSettings } = useUpdateSettings();

  return (
    <>
      <div className="flex flex-col gap-3 items-start">
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
        <Button
          as={Link}
          color="secondary"
          radius="sm"
          href="/auth/todoist/authorize"
        >
          <Todoist /> Connect Todoist
        </Button>
      </div>
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
    </>
  );
}
