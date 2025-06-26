import { Page } from '@playwright/test';

export class LoginPage {
    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async navigate() {
        await this.page.goto('https://dash.edu-planner.com/auth/login');
    }

    async login(email: string, password: string) {
        await this.page.getByPlaceholder('Your email').fill(email);
        await this.page.getByPlaceholder('••••••••').fill(password);
        await this.page.getByRole('button', { name: 'Sign in' }).click();
        await this.page.waitForURL(/.*startDate=.*&endDate=.*/);
    }
}