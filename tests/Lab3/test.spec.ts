import { test, expect } from '@playwright/test';

const baseUrl = 'https://demoqa.com';
const username = `katsemir_${Math.floor(Math.random() * 10000)}`; // Унікальне ім’я
const password = 'Jv3@pQ!8';

let token: string;
let userId: string;

test.describe('Лабораторна 3: Повний цикл (створення -> логін -> перевірка -> видалення)', () => {

  test.beforeAll(async ({ request }) => {
    const response = await request.post(`${baseUrl}/Account/v1/User`, {
      data: {
        userName: username,
        password: password,
      },
    });

    expect(response.status()).toBe(201);
    const data = await response.json();
    userId = data.userID;
    console.log(`✅ Користувач створений: ${username} (ID: ${userId})`);
  });

  test('Логін через UI, перехоплення токена, перевірка профілю', async ({ page }) => {
    await page.goto(`${baseUrl}/login`);

    const responsePromise = page.waitForResponse('**/Account/v1/Login');

    await page.getByPlaceholder('UserName').fill(username);
    await page.getByPlaceholder('Password').fill(password);
    await page.getByRole('button', { name: 'Login' }).click();

    const response = await responsePromise;
    const loginData = await response.json();

    expect(response.ok()).toBeTruthy();
    expect(loginData).toHaveProperty('token');

    token = loginData.token;
    console.log(`✅ Токен отримано: ${token}`);

    const profileResponse = await page.request.get(`${baseUrl}/Account/v1/User/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    expect(profileResponse.ok()).toBeTruthy();
    const profile = await profileResponse.json();
    expect(profile.username).toBe(username);
    console.log(`✅ Профіль перевірено: ${profile.username}`);
  });

  test.afterAll(async ({ request }) => {
    if (!token || !userId) {
      console.log('⚠️ Пропущено видалення: токен або userId не визначено.');
      return;
    }

    const response = await request.delete(`${baseUrl}/Account/v1/User/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.status() === 204) {
      console.log(`🗑️ Користувач видалений (ID: ${userId})`);
    } else {
      console.log(`❌ Не вдалося видалити: ${response.status()} ${response.statusText()}`);
    }

    expect([204, 401]).toContain(response.status());
  });
});
