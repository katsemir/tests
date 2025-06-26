import { Page, expect } from '@playwright/test';

export class CalendarPage {
    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async createEvent() {
        await this.page.getByRole('button', { name: 'Create Event' }).click();
    }

    async verifySlotCreated(date: string, courseName: string) {
        const slot = this.page.locator(`[data-date="${date}"] .fc-event`)
            .filter({ hasText: '8:30a' })
            .filter({ hasText: courseName });

        await expect(slot).toBeVisible({ timeout: 10000 });
    }
}