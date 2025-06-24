import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { loginAsAdmin, createUser, deleteUser } from '../api/auth.api';

test.describe('User login & restricted access check', () => {
  let username: string;
  let password: string;
  let userId: string;

  test.beforeAll(async () => {
    await loginAsAdmin();
    username = `user${Date.now()}`;
    password = 'TestPass123!';
    userId = await createUser(username, password);
  });

  test('User should not access admin and login via UI', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(username, password);
    await loginPage.assertLoginSuccess();

    await page.goto('/admin');
    await expect(page).not.toHaveURL(/admin/);
  });

  test.afterAll(async () => {
    await deleteUser(userId);
  });
});
