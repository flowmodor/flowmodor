import { test as setup } from '@playwright/test';
import { existsSync } from 'fs';
import { mkdir } from 'fs/promises';

setup('authenticate', async ({ page }) => {
  if (!existsSync('tests/.auth')) {
    await mkdir('tests/.auth', { recursive: true });
  }

  await page.goto('/signin');
  await page.getByLabel('Email').fill('e2e@test.com');
  await page.getByLabel('Password').fill('password');
  await page.getByRole('button', { name: 'Sign in' }).click();

  await page.waitForURL('/');

  await page.context().storageState({
    path: 'tests/.auth/user.json',
  });
});
