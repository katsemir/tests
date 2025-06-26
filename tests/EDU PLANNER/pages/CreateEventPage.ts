import { Page } from '@playwright/test';

export class CreateEventPage {
    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async fillEventDetails(date: string, description: string) {
        await this.page.locator('input[type="date"][name="date"]').fill(date);

        await this.page.locator('button:has-text("Select items")').first().click();
        await this.page.locator('label:has-text("e2e course")').first().click();

        await this.page.locator('button:has-text("Select items")').click();
        await this.page.locator('label:has-text("8:30 - 10:30 (Перша пара)")').click();

        await this.page.getByPlaceholder('Enter Description').fill(description);
        await this.page.locator('label:has-text("Lecture") input[type="radio"]').check();
    }

    async submitEvent() {
        await this.page.getByRole('button', { name: 'Create', exact: true }).click();
    }
}