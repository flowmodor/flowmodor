'use client';

import { Button } from '@nextui-org/button';
import { Input } from '@nextui-org/input';
import { Link } from '@nextui-org/link';
import { useState } from 'react';
import { toast } from 'react-toastify';
import useSendPasswordReset from '@/hooks/useSendPasswordReset';

export default function ForgotPassword() {
  const [emailValue, setEmailValue] = useState('');
  const { isSent, isLoading, sendPasswordReset } = useSendPasswordReset();

  const handleSendPasswordReset = async () => {
    const { error } = await sendPasswordReset(emailValue);
    if (error) {
      toast(error.message);
      setEmailValue('');
    }
  };

  return (
    <div className="flex flex-col gap-5 text-center sm:w-96">
      <h1 className="text-3xl font-semibold">Forgot your password?</h1>
      {isSent ? (
        <div className="text-sm">
          You’ve been emailed a password reset link.
        </div>
      ) : (
        <>
          <div className="mx-auto w-[70vw] text-sm sm:w-auto">
            To reset your password, please enter the email address of your
            Flowmodor account.
          </div>
          <Input
            label="Email"
            labelPlacement="outside"
            placeholder="you@example.com"
            variant="bordered"
            type="email"
            radius="sm"
            classNames={{
              base: 'my-5',
              input: 'text-[16px]',
              inputWrapper:
                'border-secondary data-[hover=true]:border-secondary data-[focus=true]:!border-primary',
            }}
            value={emailValue}
            onValueChange={setEmailValue}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSendPasswordReset();
              }
            }}
          />
          <Button
            color="primary"
            radius="sm"
            isLoading={isLoading}
            onPress={handleSendPasswordReset}
          >
            Reset my password
          </Button>
        </>
      )}
      <Link
        href="/signin"
        className="mx-auto text-sm text-white"
        underline="always"
      >
        Go to signin
      </Link>
    </div>
  );
}
