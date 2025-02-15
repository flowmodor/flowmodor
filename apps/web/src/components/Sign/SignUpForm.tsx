'use client';

import { Input } from '@heroui/input';
import { useState } from 'react';
import { Hide, Show } from '@/components/Icons';
import { validateEmail, validatePassword } from '@/utils';
import Submit from '../Submit';

export default function SignUpForm() {
  const [emailValue, setEmailValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <>
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
    </>
  );
}
