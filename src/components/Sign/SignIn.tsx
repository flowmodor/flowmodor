'use client';

import { Button } from '@nextui-org/button';
import { Input } from '@nextui-org/input';
import { Link } from '@nextui-org/link';
import { useState, useTransition } from 'react';
import { signInWithOAuth, signInWithPassword } from '@/actions/auth';
import { Google } from '@/components/Icons';
import Or from '@/components/Or';
import Submit from '../Submit';

export default function SignIn() {
  const [emailValue, setEmailValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');
  const [isLoading, startTransition] = useTransition();

  return (
    <form
      action={signInWithPassword}
      className="flex flex-col gap-5 text-center sm:w-96"
    >
      <h1 className="mb-5 text-3xl font-semibold">Welcome back</h1>
      <Button
        color="secondary"
        radius="sm"
        type="button"
        isLoading={isLoading}
        onPress={() => {
          startTransition(async () => {
            // eslint-disable-next-line no-restricted-globals
            await signInWithOAuth(location.origin, 'google');
          });
        }}
      >
        {isLoading ? null : <Google />}
        Continue with Google
      </Button>
      <Or />
      <Input
        name="email"
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
        name="password"
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
      />
      <Link
        href="/forgot-password"
        className="mx-auto mt-5 text-sm text-white"
        underline="always"
      >
        Forgot password?
      </Link>
      <Submit>Sign In</Submit>
      <div className="mx-auto text-sm">
        Don&apos;t have an account?{' '}
        <Link href="/signup" className="text-sm text-white" underline="always">
          Sign up now
        </Link>
      </div>
    </form>
  );
}
