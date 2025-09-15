import { test, expect } from '@playwright/test';
const BASE = process.env.WEB_URL!;
test('home loads and nav works', async ({ page }) => {
  await page.goto(BASE);
  await expect(page.getByText('Welcome to OrderFlow')).toBeVisible();
  await page.getByRole('link', { name: 'Orders' }).click();
  await expect(page.getByText('Orders')).toBeVisible();
});
