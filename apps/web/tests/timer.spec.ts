import { expect, test } from '@playwright/test';

test.describe('Timer', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should complete a full cycle', async ({ page }) => {
    const startButton = page.getByRole('button', { name: 'Start' });
    const progressMode = page.locator('#mode');
    const progressTime = page.locator('#time');

    await startButton.click();

    await expect(progressMode).toHaveText('Focus');
    await expect(progressTime).toHaveText('00:00');

    await page.waitForTimeout(10000);

    await expect(progressTime).toHaveText('00:10');

    const stopButton = page.getByRole('button', { name: 'Stop' });
    await stopButton.click();

    await expect(progressMode).toHaveText('Break');
    await expect(progressTime).toHaveText('00:02');

    await startButton.click();

    await page.waitForTimeout(2000);

    await expect(startButton).toBeVisible();
    await expect(progressMode).toHaveText('Focus');
    await expect(progressTime).toHaveText('00:00');
  });

  test('should pause and resume timer correctly', async ({ page }) => {
    const startButton = page.getByRole('button', { name: 'Start' });
    const progressMode = page.locator('#mode');
    const progressTime = page.locator('#time');

    await startButton.click();

    await expect(progressMode).toHaveText('Focus');
    await expect(progressTime).toHaveText('00:00');

    await page.waitForTimeout(5000);

    const pauseButton = page.getByRole('button', { name: 'Pause' });
    await pauseButton.click();

    await page.waitForTimeout(3000);

    const resumeButton = page.getByRole('button', { name: 'Resume' });
    await resumeButton.click();

    await page.waitForTimeout(5000);

    await expect(progressTime).toHaveText('00:10');
  });

  test('should switch to break mode when stopped after pause', async ({
    page,
  }) => {
    const startButton = page.getByRole('button', { name: 'Start' });
    const progressMode = page.locator('#mode');
    const progressTime = page.locator('#time');

    await startButton.click();

    await expect(progressMode).toHaveText('Focus');
    await expect(progressTime).toHaveText('00:00');

    await page.waitForTimeout(5000);

    const pauseButton = page.getByRole('button', { name: 'Pause' });
    await pauseButton.click();

    await page.waitForTimeout(5000);

    const stopButton = page.getByRole('button', { name: 'Stop' });
    await stopButton.click();

    await expect(progressMode).toHaveText('Break');
    await expect(progressTime).toHaveText('00:01');
  });

  test('should skip break session', async ({ page }) => {
    const startButton = page.getByRole('button', { name: 'Start' });
    const progressMode = page.locator('#mode');
    const progressTime = page.locator('#time');

    await startButton.click();

    await expect(progressMode).toHaveText('Focus');
    await expect(progressTime).toHaveText('00:00');

    await page.waitForTimeout(5000);

    const stopButton = page.getByRole('button', { name: 'Stop' });
    await stopButton.click();

    await expect(progressMode).toHaveText('Break');
    await expect(progressTime).toHaveText('00:01');

    const skipButton = page.getByRole('button', { name: 'Skip break' });
    await skipButton.click();

    await expect(progressMode).toHaveText('Focus');
    await expect(progressTime).toHaveText('00:00');
  });

  test('should toggle time visibility', async ({ page }) => {
    const startButton = page.getByRole('button', { name: 'Start' });
    const progressMode = page.locator('#mode');
    const progressTime = page.locator('#time');

    await startButton.click();

    await expect(progressMode).toHaveText('Focus');
    await expect(progressTime).toHaveText('00:00');

    const hideTimeButton = page.getByRole('button', { name: 'Hide time' });
    await hideTimeButton.click();

    await expect(progressTime).toBeHidden();

    const showTimeButton = page.getByRole('button', { name: 'Show time' });
    await showTimeButton.click();

    await expect(progressTime).toBeVisible();
  });
});
