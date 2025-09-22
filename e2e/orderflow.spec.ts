import { test, expect } from '@playwright/test';

const BASE = process.env.BASE_URL!;

test('create order and view in analytics', async ({ page }) => {
  await page.goto(`${BASE}/orders`);
  await page.fill('input[placeholder=Customer]', 'TestUser');
  await page.fill('input[placeholder=Amount]', '5');
  await page.click('text=Create');
  await expect(page.locator('li', { hasText: 'TestUser' })).toBeVisible();
  await page.goto(`${BASE}/analytics`);
  await expect(page.locator('h2')).toContainText('Analytics');
});
