'use client';

import { useState } from 'react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { Input } from '@nextui-org/input';
import { Button } from '@nextui-org/button';
import { Hide, Show } from '@/components/Icons';
import useChangePassword from '@/hooks/useChangePassword';
import { validatePassword } from '@/utils';

export default function Account() {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);
  const { isLoading, changePassword } = useChangePassword();
  const router = useRouter();

  const handleChangePassword = async () => {
    if (isLoading || password !== confirm || password === '') {
      return;
    }

    const { error } = await changePassword(password);
    setPassword('');
    setConfirm('');

    if (error) {
      toast(error.message);
    } else {
      toast('Password changed successfully.');
      router.push('/');
    }
  };

  return (
    <div className="flex flex-col gap-10">
      <div className="text-center">
        <h1 className="text-2xl font-semibold">Change Password</h1>
        <div className="text-sm">Enter a new password for your account.</div>
      </div>
      <Input
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
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleChangePassword();
          }
        }}
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
      <Button
        radius="sm"
        color="primary"
        isDisabled={password !== confirm || password === ''}
        isLoading={isLoading}
        onPress={handleChangePassword}
      >
        Set Password
      </Button>
    </div>
  );
}
