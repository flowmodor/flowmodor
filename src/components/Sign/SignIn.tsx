'use client';

import { Button } from '@nextui-org/button';
import { Input } from '@nextui-org/input';
import { Link } from '@nextui-org/link';
import { useState, useTransition } from 'react';
import { toast } from 'react-toastify';
import { signInWithOAuth, signInWithPassword } from '@/actions/auth';
import { Google } from '@/components/Icons';
import Or from '@/components/Or';

export default function SignIn() {
  const [emailValue, setEmailValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');
  const [isLoading, startTransition] = useTransition();

  const handleSignIn = (signIn: () => Promise<any>) => {
    startTransition(async () => {
      const { error } = await signIn();

      if (error) {
        toast(error.message);
        console.error(error);
      }
    });
  };

  return (
    <div className="flex flex-col gap-5 text-center sm:w-96">
      <h1 className="mb-5 text-3xl font-semibold">Welcome back</h1>
      <Button
        color="secondary"
        radius="sm"
        isDisabled={isLoading}
        onPress={() =>
          // eslint-disable-next-line no-restricted-globals
          handleSignIn(() => signInWithOAuth(location.origin, 'google'))
        }
      >
        <Google />
        Continue with Google
      </Button>
      <Or />
      <Input
        label="Email"
        labelPlacement="outside"
        placeholder="you@example.com"
        variant="bordered"
        type="email"
        radius="sm"
        classNames={{
          input: 'text-[16px]',
          inputWrapper:
            'border-secondary data-[hover=true]:border-secondary data-[focus=true]:!border-primary',
        }}
        value={emailValue}
        onValueChange={setEmailValue}
      />
      <Input
        label="Password"
        labelPlacement="outside"
        placeholder="••••••••"
        variant="bordered"
        type="password"
        radius="sm"
        classNames={{
          input: 'text-[16px]',
          inputWrapper:
            'border-secondary data-[hover=true]:border-secondary data-[focus=true]:!border-primary',
        }}
        value={passwordValue}
        onValueChange={setPasswordValue}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleSignIn(() => signInWithPassword(emailValue, passwordValue));
          }
        }}
      />
      <Link
        href="/forgot-password"
        className="mx-auto mt-5 text-sm text-white"
        underline="always"
      >
        Forgot password?
      </Link>
      <Button
        color="primary"
        radius="sm"
        isLoading={isLoading}
        onPress={() =>
          handleSignIn(() => signInWithPassword(emailValue, passwordValue))
        }
      >
        Sign In
      </Button>
      <div className="mx-auto text-sm">
        Don&apos;t have an account?{' '}
        <Link href="/signup" className="text-sm text-white" underline="always">
          Sign up now
        </Link>
      </div>
    </div>
  );
}
