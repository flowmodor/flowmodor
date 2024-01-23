'use client';

import { useState } from 'react';
import { Google, Hide, Show } from '@/components/Icons';
import { Button } from '@nextui-org/button';
import { Input } from '@nextui-org/input';
import useSignUp from '@/hooks/useSignUp';
import { toast } from 'react-toastify';
import { validateEmail, validatePassword } from '@/utils';
import Or from '@/components/Or';
import { Link } from '@nextui-org/react';

export default function SignUp() {
  const [emailValue, setEmailValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);
  const { isLoading, signUp } = useSignUp();

  return (
    <div className="flex flex-col gap-5 text-center sm:w-96">
      <h1 className="text-3xl font-semibold">Get started</h1>

      <span>
        Join{' '}
        <Link href="https://flowmodor.com/#waitlist" underline="always">
          waitlist
        </Link>{' '}
        to get early access.
      </span>
      <Button color="secondary" radius="sm" isDisabled>
        <Google />
        Continue with Google
      </Button>
      <Or />
      <Input
        isDisabled
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
          input: 'text-[16px]',
          inputWrapper:
            'border-secondary data-[hover=true]:border-secondary data-[focus=true]:!border-primary',
        }}
      />
      <Input
        isDisabled
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
          input: 'text-[16px]',
          inputWrapper:
            'border-secondary data-[hover=true]:border-secondary data-[focus=true]:!border-primary',
        }}
        endContent={
          <button
            className="focus:outline-none"
            type="button"
            disabled
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
        isDisabled
        // isDisabled={
        //   !(
        //     validateEmail(emailValue) &&
        //     validatePassword(passwordValue) &&
        //     emailValue !== '' &&
        //     passwordValue !== ''
        //   )
        // }
        className="mt-10"
        onPress={async () => {
          const { error } = await signUp(emailValue, passwordValue);

          if (error) {
            console.error(error);
          }

          const message = error
            ? 'Something went wrong. Please try again.'
            : 'Sign up successfully! Check your email to verify your account.';
          toast(message);

          setEmailValue('');
          setPasswordValue('');
        }}
      >
        Sign Up
      </Button>
      <div className="mx-auto text-sm">
        Have an account?{' '}
        <Link href="/signin" className="text-sm text-white" underline="always">
          Sign in now
        </Link>
      </div>
    </div>
  );
}
