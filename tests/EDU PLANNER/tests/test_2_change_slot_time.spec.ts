import { test, expect } from '@playwright/test';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

test('Зміна часу Lesson Slot без зчитування поточного', async ({ page }) => {
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

  const dropdowns = page.locator('div[role="dialog"] button[hlmenubutton]');
  await dropdowns.nth(1).click({ force: true });

  const availableSlots = page.locator('div[role="dialog"] label:has-text("пара"):not([aria-checked="true"])');
  const count = await availableSlots.count();

  if (count === 0) throw new Error('❌ Немає іншого доступного слоту для вибору.');

  await availableSlots.first().click();

  await page.getByRole('button', { name: 'Update' }).click();

  await expect(page.locator(`.fc-daygrid-day:has-text("${dayNumber}") .fc-event`)).toBeVisible();
});