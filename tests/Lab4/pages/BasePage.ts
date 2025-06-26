import { Page, Locator } from '@playwright/test';

export class BasePage {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async visit(url: string) {
    await this.page.goto(url);
    await this.page.waitForLoadState('domcontentloaded');
  }

  async getTitle(): Promise<string> {
    await this.page.waitForLoadState('domcontentloaded');
    return this.page.title();
  }

  async waitForSelector(selector: string) {
    await this.page.locator(selector).waitFor();
  }

  async getElement(selector: string): Promise<Locator> {
    return this.page.locator(selector);
  }

  async clickElement(selector: string) {
    await this.page.locator(selector).click();
  }

  async typeText(selector: string, text: string) {
    await this.page.locator(selector).fill(text);
  }
}
