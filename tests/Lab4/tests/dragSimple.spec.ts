import { test, expect } from '@playwright/test';
import { DroppablePage } from '../pages/DroppablePage';
import { getEnv } from '../utils/helpers';

test.describe('Drag and Drop Tests', () => {
  const url = getEnv('DEMO_URL', 'https://demoqa.com/droppable');

  test.beforeEach(async ({ page }) => {
    await page.goto(url);
  });

  test('Element should be dropped successfully', async ({ page }) => {
    const droppablePage = new DroppablePage(page);
    await droppablePage.dragAndDrop('#draggable', '#droppable');
    const dropText = await droppablePage.getDropZoneText('#droppable');
    expect(dropText).toBe('Dropped!');
  });
});
