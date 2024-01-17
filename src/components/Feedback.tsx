import { useState } from 'react';
import { Button } from '@nextui-org/button';
import { Textarea } from '@nextui-org/input';
import { Popover, PopoverTrigger, PopoverContent } from '@nextui-org/popover';
import supabase from '@/utils/supabase';

export default function Feedback() {
  const [isOpen, setIsOpen] = useState(false);
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

    setIsOpen(false);
    setValue('');
  };

  return (
    <Popover
      isOpen={isOpen}
      onOpenChange={(open) => setIsOpen(open)}
      placement="top"
      offset={10}
      classNames={{
        content: 'bg-[#23223C]',
      }}
    >
      <PopoverTrigger>
        <Button
          color="secondary"
          size="sm"
          radius="sm"
          className="absolute bottom-3 right-3"
        >
          Feedback
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <Textarea
          value={value}
          onValueChange={setValue}
          placeholder="Bug report, feature request, or any feedback."
          classNames={{
            base: 'mt-2',
            inputWrapper:
              'bg-secondary data-[hover=true]:bg-secondary data-[focus=true]:!bg-secondary',
          }}
        />
        <div className="flex w-full justify-between py-2">
          <Button
            color="secondary"
            size="sm"
            radius="sm"
            onPress={() => setIsOpen(false)}
          >
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
      </PopoverContent>
    </Popover>
  );
}
