'use client';

import { Button } from '@nextui-org/button';
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@nextui-org/modal';
import { useDisclosure } from '@nextui-org/use-disclosure';
import { toast } from 'sonner';
import { signOut } from '@/actions/auth';
import supabase from '@/utils/supabase';

export default function Account() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <div className="flex flex-col gap-3 items-start">
      <div className="flex items-center gap-3">
        <h2 className="text-xl font-semibold">Delete account</h2>
      </div>
      <div className="text-xs text-foreground-400">
        This will permanently delete your account and all of its data. You will
        not be able to reactivate this account.
      </div>
      <Button variant="bordered" color="danger" radius="sm" onPress={onOpen}>
        Delete my account
      </Button>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        classNames={{
          base: 'bg-midground',
        }}
      >
        <ModalContent>
          <ModalHeader>Delete account</ModalHeader>
          <ModalBody>
            This will permanently delete your account and all of its data. You
            will not be able to reactivate this account.
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" radius="sm" onPress={onOpenChange}>
              Cancel
            </Button>
            <Button
              color="danger"
              radius="sm"
              onPress={async () => {
                const { error } = await supabase.rpc('delete_account');
                if (error) {
                  toast.error(error.message);
                  return;
                }

                await signOut();
              }}
            >
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
