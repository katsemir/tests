import { Page, Locator } from '@playwright/test';

export class SortablePage {
  readonly page: Page;
  readonly listItems: Locator;

  constructor(page: Page) {
    this.page = page;
    this.listItems = page.locator('.vertical-list-container .list-group-item');
  }

  async goto() {
    await this.page.goto('https://demoqa.com/sortable');
  }

  async getListOrder(): Promise<string[]> {
    return await this.listItems.allTextContents();
  }

  async dragItem(fromIndex: number, toIndex: number) {
    const items = this.listItems;
    const from = items.nth(fromIndex);
    const to = items.nth(toIndex);

    await from.dragTo(to);
  }
}