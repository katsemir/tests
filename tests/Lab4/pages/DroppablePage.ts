import { Page } from 'playwright';
import { BasePage } from './BasePage';

export class DroppablePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async dragAndDrop(sourceSelector: string, targetSelector: string) {
    const source = this.page.locator(sourceSelector);
    const target = this.page.locator(targetSelector);

    await source.waitFor();
    await target.waitFor();

    await source.dragTo(target);
  }

  async getDropZoneText(selector: string): Promise<string> {
    const text = await this.page.locator(selector).textContent();
    return text?.trim() || '';
  }
}