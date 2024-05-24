'use client';

import { Button } from '@nextui-org/button';
import { Textarea } from '@nextui-org/input';
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@nextui-org/react';
import { useDisclosure } from '@nextui-org/use-disclosure';
import Link from 'next/link';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import supabase from '@/utils/supabase';

export default function SuggestButton({ user }: { user: any }) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [value, setValue] = useState('');
  const isValid = value.trim().length > 0;
  const [isPending, startTransition] = useTransition();

  if (!user) {
    return (
      <Button as={Link} href="/signin" radius="sm" color="secondary">
        Make a suggestion
      </Button>
    );
  }

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
      toast.success('Feedback sent successfully!');
      setValue('');
      onClose();
    } else {
      toast.error(error.message);
    }
  };

  return (
    <>
      <Button radius="sm" color="secondary" onPress={onOpen}>
        Make a suggestion
      </Button>
      <Modal
        isOpen={isOpen}
        onClose={onOpenChange}
        classNames={{
          base: 'bg-midground',
        }}
      >
        <ModalContent>
          <ModalHeader>Make a suggestion</ModalHeader>
          <ModalBody>
            <Textarea
              radius="sm"
              value={value}
              onValueChange={setValue}
              placeholder="What problem are you facing? How can we improve?"
              classNames={{
                inputWrapper:
                  'bg-secondary data-[hover=true]:bg-secondary data-[focus=true]:!bg-secondary',
              }}
            />
          </ModalBody>
          <ModalFooter>
            <Button
              color="primary"
              radius="sm"
              isLoading={isPending}
              isDisabled={!isValid}
              onPress={() => {
                startTransition(async () => {
                  await handleSend();
                });
              }}
            >
              Send
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
