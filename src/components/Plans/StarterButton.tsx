'use client';

import { Button } from '@nextui-org/button';
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from '@nextui-org/modal';
import { useTransition } from 'react';

export default function StarterButton({ isPro }: { isPro: boolean }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isLoading, startTransition] = useTransition();

  return (
    <>
      <Button
        isDisabled={!isPro}
        color="primary"
        radius="sm"
        className="font-semibold text-[#23223C]"
        onPress={onOpen}
      >
        {isPro ? 'Downgrade to Starter' : 'Current plan'}
      </Button>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        classNames={{
          base: 'bg-[#23223C]',
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Confirm Subscription Cancellation
              </ModalHeader>
              <ModalBody>
                Are you sure you wish to cancel your subscription? You will
                retain access to Pro features until the end of your current
                billing period. Note that your subscription will not be renewed,
                and you will not be charged starting from the next month.
              </ModalBody>
              <ModalFooter>
                <Button
                  isDisabled={isLoading}
                  color="secondary"
                  onPress={onClose}
                >
                  Go Back
                </Button>
                <Button
                  color="primary"
                  isLoading={isLoading}
                  onPress={() => {
                    startTransition(async () => {
                      // TODO: cancel subscription
                      onClose();
                    });
                  }}
                >
                  Yes, Cancel Subscription
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
