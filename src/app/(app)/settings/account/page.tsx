'use client';

import { Input } from '@nextui-org/input';
import { useState } from 'react';
import { updatePassword } from '@/actions/auth';
import { Hide, Show } from '@/components/Icons';
import Submit from '@/components/Submit';
import { validatePassword } from '@/utils';

export default function Account() {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <form
      action={updatePassword}
      className="flex h-full flex-col justify-center gap-10"
    >
      <div className="text-center">
        <h1 className="text-2xl font-semibold">Change Password</h1>
        <div className="text-sm">Enter a new password for your account.</div>
      </div>
      <Input
        name="password"
        label="New password"
        labelPlacement="outside"
        placeholder="••••••••"
        variant="bordered"
        radius="sm"
        value={password}
        onValueChange={setPassword}
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
        isInvalid={!validatePassword(password)}
        errorMessage={
          !validatePassword(password) &&
          'Password must be at least 8 characters'
        }
      />
      <Input
        label="Confirm password"
        labelPlacement="outside"
        placeholder="••••••••"
        variant="bordered"
        radius="sm"
        value={confirm}
        onValueChange={setConfirm}
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
        isInvalid={password !== confirm}
        errorMessage={password !== confirm && 'Passwords do not match.'}
      />
      <Submit isDisabled={password === '' || password !== confirm}>
        Set Password
      </Submit>
    </form>
  );
}
