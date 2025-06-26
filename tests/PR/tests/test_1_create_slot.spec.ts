import { test, expect } from '@playwright/test';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

test('Створення Lesson Slot', async ({ page }) => {
  const login = process.env.LOGIN;
  const password = process.env.PASSWORD;

  if (!login || !password) {
    throw new Error('❌ LOGIN або PASSWORD не задані в .env');
  }

  await page.goto('https://dash.edu-planner.com/auth/login');
  await page.getByPlaceholder('Your email').fill(login);
  await page.getByPlaceholder('••••••••').fill(password);
  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.waitForURL(/.*startDate=.*&endDate=.*/);

  await page.getByRole('button', { name: 'Create Event' }).click();

  const today = new Date().toISOString().split('T')[0];
  await page.locator('input[type="date"][name="date"]').fill(today);

  await page.locator('button:has-text("Select items")').first().click();
  await page.locator('label:has-text("e2e course")').first().click();

  await page.locator('button:has-text("Select items")').click();
  await page.locator('label:has-text("8:30 - 10:30 (Перша пара)")').click();

  await page.getByPlaceholder('Enter Description').fill('Тестове заняття');

  await page.locator('label:has-text("Lecture") input[type="radio"]').check();

  await page.getByRole('button', { name: 'Create', exact: true }).click();

  const slot = page.locator(`[data-date="${today}"] .fc-event`)
  .filter({ hasText: '8:30a' })
  .filter({ hasText: 'e2e course' });

  await expect(slot).toBeVisible({ timeout: 10000 });
});