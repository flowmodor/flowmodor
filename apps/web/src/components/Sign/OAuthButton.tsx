'use client';

import { Button } from '@nextui-org/button';
import { useTransition } from 'react';
import { signInWithOAuth } from '@/actions/auth';
import { Apple, Google } from '@/components/Icons';

export default function OAuthButton() {
  const [isGoogleLoading, startGoogleTransition] = useTransition();
  const [isAppleLoading, startAppleTransition] = useTransition();

  return (
    <>
      <Button
        color="secondary"
        radius="sm"
        type="button"
        isLoading={isAppleLoading}
        isDisabled={isGoogleLoading}
        onPress={() => {
          startAppleTransition(async () => {
            // eslint-disable-next-line no-restricted-globals
            await signInWithOAuth(location.origin, 'apple');
          });
        }}
      >
        {!isAppleLoading && <Apple />}
        Continue with Apple
      </Button>
      <Button
        color="secondary"
        radius="sm"
        type="button"
        isLoading={isGoogleLoading}
        isDisabled={isAppleLoading}
        onPress={() => {
          startGoogleTransition(async () => {
            // eslint-disable-next-line no-restricted-globals
            await signInWithOAuth(location.origin, 'google');
          });
        }}
      >
        {!isGoogleLoading && <Google />}
        Continue with Google
      </Button>
    </>
  );
}
