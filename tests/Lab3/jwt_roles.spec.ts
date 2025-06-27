import { test, expect, APIRequestContext, Page } from '@playwright/test';

const BASE_URL = 'https://demoqa.com';
const PASSWORD = 'Jv3@pQ!8';
const username = `user_${Date.now()}`;

let userId: string;
let authToken: string;

test.describe('JWT Аутентифікація: повний цикл створення, логіну та видалення', () => {

  test.beforeAll(async ({ request }) => {
    const createResponse = await request.post(`${BASE_URL}/Account/v1/User`, {
      data: {
        userName: username,
        password: PASSWORD,
      },
    });

    expect(createResponse.status()).toBe(201);
    const responseBody = await createResponse.json();
    userId = responseBody.userID;

    console.log(`✅ Користувача створено: ${username} (ID: ${userId})`);
  });

  test('UI логін та перевірка даних користувача через API', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);

    const loginResponsePromise = page.waitForResponse('**/Account/v1/Login');

    await page.getByPlaceholder('UserName').fill(username);
    await page.getByPlaceholder('Password').fill(PASSWORD);
    await page.getByRole('button', { name: 'Login' }).click();

    const loginResponse = await loginResponsePromise;
    const loginData = await loginResponse.json();

    expect(loginResponse.ok()).toBeTruthy();
    expect(loginData).toHaveProperty('token');

    authToken = loginData.token;
    console.log(`✅ Токен отримано: ${authToken}`);

    const profileResponse = await page.request.get(`${BASE_URL}/Account/v1/User/${userId}`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    expect(profileResponse.ok()).toBeTruthy();
    const profileData = await profileResponse.json();

    expect(profileData.username).toBe(username);
    console.log(`✅ Профіль перевірено: ${profileData.username}`);
  });

  test.afterAll(async ({ request }) => {
    if (!authToken || !userId) {
      console.warn('⚠️ Видалення пропущене — токен або userId не визначено.');
      return;
    }

    const deleteResponse = await request.delete(`${BASE_URL}/Account/v1/User/${userId}`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (deleteResponse.status() === 204) {
      console.log(`🗑️ Користувач видалений успішно (ID: ${userId})`);
    } else {
      console.error(`❌ Видалення не вдалося: ${deleteResponse.status()} ${deleteResponse.statusText()}`);
    }

    expect([204, 401]).toContain(deleteResponse.status());
  });
});
