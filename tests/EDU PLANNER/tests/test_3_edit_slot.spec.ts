import { test, expect } from '@playwright/test';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

test('Редагування Lesson Slot (зміна дати, типу і опису)', async ({ page }) => {
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

  const today = new Date();
  const dayNumber = today.getDate().toString();

  const slotLocator = page.locator(`.fc-daygrid-day:has-text("${dayNumber}") .fc-event`);
  await expect(slotLocator.first()).toBeVisible();
  await slotLocator.first().click();

  const weekAgo = new Date();
  weekAgo.setDate(today.getDate() - 7);
  const newDateStr = weekAgo.toISOString().split('T')[0];
  const newDay = weekAgo.getDate().toString();

  await page.locator('input[type="date"][name="date"]').fill(newDateStr);

  await page.locator('label:has-text("Exam") input[type="radio"]').check();

  await page.getByPlaceholder('Enter Description').fill('Оновлений опис');

  await page.getByRole('button', { name: 'Update' }).click();

  await expect(page.locator(`.fc-daygrid-day:has-text("${dayNumber}") .fc-event`)).toHaveCount(0);

  await page.locator(`.fc-daygrid-day:has-text("${newDay}")`).click();
});