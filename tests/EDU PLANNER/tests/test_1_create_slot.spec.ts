import { test } from '@playwright/test';
import * as dotenv from 'dotenv';
import path from 'path';
import { CalendarPage } from '../pages/CalendarPage';
import { CreateEventPage } from '../pages/CreateEventPage';
import { LoginPage } from '../pages/LoginPage';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

test('Створення Lesson Slot', async ({ page }) => {
    const login = process.env.LOGIN;
    const password = process.env.PASSWORD;

    if (!login || !password) {
        throw new Error('❌ LOGIN або PASSWORD не задані в .env');
    }

    const loginPage = new LoginPage(page);
    const calendarPage = new CalendarPage(page);
    const createEventPage = new CreateEventPage(page);

    await loginPage.navigate();
    await loginPage.login(login, password);

    await calendarPage.createEvent();

    const today = new Date().toISOString().split('T')[0];
    await createEventPage.fillEventDetails(today, 'Тестове заняття');
    await createEventPage.submitEvent();

    await calendarPage.verifySlotCreated(today, 'e2e course');
});