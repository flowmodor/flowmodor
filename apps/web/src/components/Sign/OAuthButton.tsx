'use client';

import { Button } from '@nextui-org/button';
import { useTransition } from 'react';
import { signInWithOAuth } from '@/actions/auth';
import { Google } from '@/components/Icons';

export default function OAuthButton() {
  const [isLoading, startTransition] = useTransition();

  return (
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
  );
}
