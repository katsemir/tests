import { test, expect } from '@playwright/test';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

test('Health-check: доступність сайту та логін', async ({ page }) => {
  const login = process.env.LOGIN;
  const password = process.env.PASSWORD;

  if (!login || !password) {
    throw new Error('❌ LOGIN або PASSWORD не задані в .env');
  }

  await page.goto('https://dash.edu-planner.com');
  await expect(page).toHaveTitle(/EDU PLANNER/i);

  await page.goto('https://dash.edu-planner.com/auth/login');
  await expect(page.getByPlaceholder('Your email')).toBeVisible();

  await page.getByPlaceholder('Your email').fill(login);
  await page.getByPlaceholder('••••••••').fill(password);
  await page.getByRole('button', { name: 'Sign in' }).click();

  await expect(page).toHaveURL(/startDate=.*&endDate=.*/);
  await expect(page.locator('text=Create Event')).toBeVisible();
});