'use client';

import { useState } from 'react';
// import { Google } from '@/components/Icons';
import { Button } from '@nextui-org/button';
import { Input } from '@nextui-org/input';
import Link from 'next/link';
import useSignIn from '@/hooks/useSignIn';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

export default function SignIn() {
  const [emailValue, setEmailValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');
  const { isLoading, signIn } = useSignIn();
  const router = useRouter();

  const handleSignIn = async () => {
    const { error } = await signIn(emailValue, passwordValue);

    if (error) {
      toast(error.message, { position: 'top-right' });
      console.error(error);
    } else {
      console.log('Signed in successfully');
      router.push('/');
    }
  };

  return (
    <div className="flex flex-col gap-5 sm:w-96">
      <h1 className="mx-auto mb-5 text-3xl font-semibold">Welcome back</h1>
      {/*
      <Button color="secondary" radius="sm">
        <Google />
        Continue with Google
      </Button>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="border-strong w-full border-t border-secondary" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-background px-2 text-sm">or</span>
        </div>
      </div>
        */}
      <Input
        label="Email"
        labelPlacement="outside"
        placeholder="you@example.com"
        variant="bordered"
        type="email"
        radius="sm"
        classNames={{
          input: 'text-[16px]',
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
        }}
        value={passwordValue}
        onValueChange={setPasswordValue}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleSignIn();
          }
        }}
      />
      <Button
        color="primary"
        radius="sm"
        className="mt-10"
        isLoading={isLoading}
        onPress={handleSignIn}
      >
        Sign In
      </Button>
      <div className="mx-auto text-sm">
        Don&apos;t have an account?{' '}
        <Link href="/signup" className="underline">
          Sign Up Now
        </Link>
      </div>
    </div>
  );
}
