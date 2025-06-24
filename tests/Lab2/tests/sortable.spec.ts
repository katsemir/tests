import { test, expect } from '@playwright/test';
import { SortablePage } from '../pages/sortable.page';

test.describe('Sortable List', () => {
  let sortablePage: SortablePage;

  test.beforeEach(async ({ page }) => {
    sortablePage = new SortablePage(page);
    await sortablePage.goto();
  });

  test('Сортування даних: перетягування елемента', async ({ page }) => {
    // Arrange
    const initialOrder = await sortablePage.getListOrder();

    // Act
    await sortablePage.dragItem(0, 3); // Перетягнути перший елемент у позицію 4
    const newOrder = await sortablePage.getListOrder();

    // Assert
    expect(newOrder).not.toEqual(initialOrder);
    expect(newOrder[3]).toBe(initialOrder[0]); // Перевірити, що елемент перемістився

    // Log (не обов’язково, але корисно)
    console.log('Було:', initialOrder);
    console.log('Стало:', newOrder);
  });
});