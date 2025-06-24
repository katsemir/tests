import { Page } from '@playwright/test';

export class RegistrationPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('https://demoqa.com/automation-practice-form');
  }

  async fillForm(data: { firstName: string; lastName: string; email: string }) {
    await this.page.fill('#firstName', data.firstName);
    await this.page.fill('#lastName', data.lastName);
    await this.page.fill('#userEmail', data.email);
    await this.page.click('label[for="gender-radio-1"]'); // Male
    await this.page.fill('#userNumber', '0991234567');
  }

  async submitForm() {
    await this.page.click('#submit');
  }

  async expectSuccessModal() {
    await this.page.waitForSelector('#example-modal-sizes-title-lg');
  }
}