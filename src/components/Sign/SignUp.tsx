'use client';

import { Input } from '@nextui-org/input';
import { Link } from '@nextui-org/link';
import { useState } from 'react';
import { signUp } from '@/actions/auth';
import { Hide, Show } from '@/components/Icons';
import { validateEmail, validatePassword } from '@/utils';
import Submit from '../Submit';

export default function SignUp() {
  const [emailValue, setEmailValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <form action={signUp} className="flex flex-col gap-5 text-center sm:w-96">
      <h1 className="text-3xl font-semibold">Get started</h1>
      <Input
        name="email"
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
        name="password"
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
      <Submit
        isDisabled={
          !(
            validateEmail(emailValue) &&
            validatePassword(passwordValue) &&
            emailValue !== '' &&
            passwordValue !== ''
          )
        }
      >
        Sign Up
      </Submit>
      <div className="mx-auto text-sm">
        Have an account?{' '}
        <Link href="/signin" className="text-sm text-white" underline="always">
          Sign in now
        </Link>
      </div>
    </form>
  );
}
