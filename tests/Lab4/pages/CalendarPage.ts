import { Page } from 'playwright';
import { BasePage } from './BasePage';

export class CalendarPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async dragLesson(sourceId: string, targetId: string) {
    const source = this.page.locator(`#${sourceId}`);
    const target = this.page.locator(`#${targetId}`);

    await source.waitFor();
    await target.waitFor();

    await source.dragTo(target);
  }

  async getLessonText(slotId: string): Promise<string> {
    const text = await this.page.locator(`#${slotId}`).textContent();
    return text?.trim() || '';
  }

  async isSlotOccupied(slotId: string): Promise<boolean> {
    const slot = this.page.locator(`#${slotId}`);
    await slot.waitFor();
    const classList = await slot.getAttribute('class');
    return classList?.includes('occupied') || false;
  }
}
