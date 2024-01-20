'use client';

import { useState } from 'react';
import { Google, Hide, Show } from '@/components/Icons';
import { Button } from '@nextui-org/button';
import { Input } from '@nextui-org/input';
import Link from 'next/link';
import useSignUp from '@/hooks/useSignUp';
import { toast } from 'react-toastify';
import { validateEmail, validatePassword } from '@/utils';

export default function SignUp() {
  const [emailValue, setEmailValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);
  const { isLoading, signUp } = useSignUp();

  return (
    <div className="flex w-96 flex-col gap-5">
      <h1 className="mx-auto text-3xl font-semibold">Get started</h1>
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
      <Input
        label="Email"
        labelPlacement="outside"
        placeholder="you@example.com"
        variant="bordered"
        type="email"
        radius="sm"
        value={emailValue}
        onValueChange={setEmailValue}
        color={!validateEmail(emailValue) ? 'danger' : 'default'}
        errorMessage={
          !validateEmail(emailValue) && 'Please enter a valid email'
        }
        isInvalid={!validateEmail(emailValue)}
        classNames={{
          inputWrapper: 'border-secondary data-[hover=true]:border-secondary',
        }}
      />
      <Input
        label="Password"
        labelPlacement="outside"
        placeholder="••••••••"
        variant="bordered"
        radius="sm"
        value={passwordValue}
        onValueChange={setPasswordValue}
        color={!validatePassword(passwordValue) ? 'danger' : 'default'}
        errorMessage={
          !validatePassword(passwordValue) &&
          'Password must be at least 8 characters'
        }
        isInvalid={!validatePassword(passwordValue)}
        classNames={{
          inputWrapper: 'border-secondary data-[hover=true]:border-secondary',
        }}
        endContent={
          <button
            className="focus:outline-none"
            type="button"
            onClick={toggleVisibility}
          >
            {isVisible ? <Hide /> : <Show />}
          </button>
        }
        type={isVisible ? 'text' : 'password'}
      />
      <Button
        color="primary"
        radius="sm"
        isLoading={isLoading}
        isDisabled={
          !(
            validateEmail(emailValue) &&
            validatePassword(passwordValue) &&
            emailValue !== '' &&
            passwordValue !== ''
          )
        }
        className="mt-10"
        onPress={async () => {
          const { error } = await signUp(emailValue, passwordValue);

          if (error) {
            console.error(error);
          }

          const message = error
            ? 'Something went wrong. Please try again.'
            : 'Sign up successfully! Check your email to verify your account.';
          toast(message, { position: 'top-right' });

          setEmailValue('');
          setPasswordValue('');
        }}
      >
        Sign Up
      </Button>
      <div className="mx-auto text-sm">
        Have an account?{' '}
        <Link href="/signin" className="underline">
          Sign In Now
        </Link>
      </div>
    </div>
  );
}
