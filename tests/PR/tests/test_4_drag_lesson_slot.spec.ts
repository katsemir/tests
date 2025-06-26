import { test, expect } from '@playwright/test';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

test('Перетягування Lesson Slot', async ({ page }) => {
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
  const minus7 = new Date(today);
  minus7.setDate(today.getDate() - 7);
  const minus14 = new Date(today);
  minus14.setDate(today.getDate() - 14);

  const dateToString = (d: Date) => d.toISOString().split('T')[0];
  const fromDateStr = dateToString(minus7);
  const toDateStr = dateToString(minus14);

  const sourceSlot = page.locator(`[data-date="${fromDateStr}"] .fc-event`).first();
  const targetCell = page.locator(`[data-date="${toDateStr}"]`).first();

  await expect(sourceSlot).toBeVisible({ timeout: 10000 });

  const boxFrom = await sourceSlot.boundingBox();
  const boxTo = await targetCell.boundingBox();
  if (!boxFrom || !boxTo) throw new Error('❌ Неможливо отримати координати для drag-and-drop');

  await page.mouse.move(boxFrom.x + boxFrom.width / 2, boxFrom.y + boxFrom.height / 2);
  await page.mouse.down();
  await page.mouse.move(boxTo.x + boxTo.width / 2, boxTo.y + boxTo.height / 2, { steps: 10 });
  await page.mouse.up();

  await expect(page.locator(`[data-date="${fromDateStr}"] .fc-event`)).toHaveCount(0);
  await expect(page.locator(`[data-date="${toDateStr}"] .fc-event`)).toHaveCount(1);
});