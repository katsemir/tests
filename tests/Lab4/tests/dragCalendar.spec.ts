import { test, expect } from '@playwright/test';
import { CalendarPage } from '../pages/CalendarPage';
import { getEnv } from '../utils/helpers';

test.describe('Calendar Drag and Drop', () => {
  const url = getEnv('CALENDAR_URL', 'http://localhost:3000/mockCalendar.html');

  test.beforeEach(async ({ page }) => {
    await page.goto(url);
  });

  test('should drag lesson from one slot to another', async ({ page }) => {
    const calendarPage = new CalendarPage(page);

    await calendarPage.dragLesson('lesson1', 'slot2');
    const text = await calendarPage.getLessonText('slot2');

    expect(text).toContain('Math');
  });

  test('should mark target slot as occupied after drag', async ({ page }) => {
    const calendarPage = new CalendarPage(page);

    await calendarPage.dragLesson('lesson1', 'slot3');
    const isOccupied = await calendarPage.isSlotOccupied('slot3');

    expect(isOccupied).toBeTruthy();
  });
});