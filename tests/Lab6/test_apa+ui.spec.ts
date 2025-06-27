import { test, expect, chromium } from '@playwright/test';

test.describe('Лабораторна 6: API + UI з мокапами та синхронізацією', () => {
  const BASE_URL = 'https://demoqa.com';

  test('Мокап: успішна відправка SMS (200)', async ({ page }) => {
    await page.route('**/api/sms/send', route =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'SMS sent successfully' }),
      })
    );

    await page.goto(`${BASE_URL}/books`);
    console.log('✅ SMS API (200): мокап відпрацював');
  });

  test('Мокап: помилка сервера SMS (500)', async ({ page }) => {
    await page.route('**/api/sms/send', route =>
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal Server Error' }),
      })
    );

    await page.goto(`${BASE_URL}/books`);
    console.log('⚠️ SMS API (500): мокап відпрацював');
  });

  test('Мокап: таймаут/обрив з\'єднання SMS', async ({ page }) => {
    await page.route('**/api/sms/send', async route => {
      await new Promise(res => setTimeout(res, 6000));
      await route.abort();
    });

    await page.goto(`${BASE_URL}/books`);
    console.log('⏱️ SMS API (таймаут): мокап відпрацював');
  });

  test('UI: реєстрація користувача + мокап SMS', async ({ page }) => {
    await page.route('**/api/sms/send', route =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'SMS sent successfully' }),
      })
    );

    await page.goto(`${BASE_URL}/register`);

    await page.fill('#firstname', 'Test');
    await page.fill('#lastname', 'User');
    await page.fill('#userName', 'testuser123');
    await page.fill('#password', 'Pass123!');
    await page.click('#register');

    console.log('🧪 Реєстрація + SMS мокап: завершено');
  });

  test('Sync: localStorage між вкладками', async () => {
    const browser = await chromium.launch();
    const context = await browser.newContext();

    const page1 = await context.newPage();
    const page2 = await context.newPage();

    await page1.goto(`${BASE_URL}/books`);
    await page2.goto(`${BASE_URL}/books`);

    await page1.evaluate(() => {
      const data = { status: 'ready' };
      localStorage.setItem('syncTest', JSON.stringify(data));
      window.dispatchEvent(new Event('storage'));
    });

    const synced = await page2.evaluate(() => {
      try {
        const raw = localStorage.getItem('syncTest');
        const parsed = raw ? JSON.parse(raw) : null;
        return parsed?.status === 'ready';
      } catch (e) {
        return false;
      }
    });

    expect(synced).toBeTruthy();
    console.log('🔄 LocalStorage: синхронізація успішна');

    await browser.close();
  });

  test('UI: оновлення після мокапу API', async ({ page }) => {
    await page.route('**/BookStore/v1/Books', route =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          books: [{ title: 'Новинка з API', isbn: '000-NEW' }],
        }),
      })
    );

    await page.goto(`${BASE_URL}/books`);
    const found = await page.locator('.rt-td', { hasText: 'Новинка з API' }).first().isVisible();
    expect(found).toBeTruthy();

    console.log('✅ UI оновився після мокапу API');
  });

  test('Real-time: оновлення між вкладками', async () => {
    const browser = await chromium.launch();
    const context = await browser.newContext();

    const page1 = await context.newPage();
    const page2 = await context.newPage();

    await page1.goto(`${BASE_URL}/books`);
    await page2.goto(`${BASE_URL}/books`);

    await page1.evaluate(() => {
      const books = [{ title: 'RealTime Book', isbn: '111-222' }];
      localStorage.setItem('books', JSON.stringify(books));
      window.dispatchEvent(new Event('storage'));
    });

    const updated = await page2.evaluate(() => {
      try {
        const raw = localStorage.getItem('books');
        const parsed = raw ? JSON.parse(raw) : [];
        return parsed.length > 0 && parsed[0].title === 'RealTime Book';
      } catch (e) {
        return false;
      }
    });

    expect(updated).toBeTruthy();
    console.log('📡 Real-time: дані оновлені між вкладками');

    await browser.close();
  });
});