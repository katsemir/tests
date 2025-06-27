import { test, expect } from '@playwright/test';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

test('Видалення Lesson Slot', async ({ page }) => {
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

  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() - 7);
  const targetDay = targetDate.getDate().toString();

  const slotLocator = page.locator(`.fc-daygrid-day:has-text("${targetDay}") .fc-event`);
  await expect(slotLocator.first()).toBeVisible({ timeout: 10000 });
  await slotLocator.first().click();

  await page.getByRole('button', { name: 'Delete' }).click();

  await page.getByRole('button', { name: 'Yes, do it!' }).click();

  await expect(page.locator(`.fc-daygrid-day:has-text("${targetDay}") .fc-event`)).toHaveCount(0);
});