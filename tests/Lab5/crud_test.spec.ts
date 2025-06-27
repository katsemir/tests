import { test, expect, Page } from '@playwright/test';

const url = 'https://demoqa.com/webtables';

const entries = [
  {
    role: 'Faculty',
    firstName: 'Faculty',
    lastName: 'Test',
    email: 'faculty@example.com',
    age: '45',
    salary: '10000',
    department: 'Faculty of Physics',
  },
  {
    role: 'Group',
    firstName: 'Group',
    lastName: 'Test',
    email: 'group@example.com',
    age: '30',
    salary: '5000',
    department: 'Phys-101',
  },
  {
    role: 'Teacher',
    firstName: 'Teacher',
    lastName: 'Test',
    email: 'teacher@example.com',
    age: '40',
    salary: '8000',
    department: 'Phys-101',
  },
];

async function addEntry(page: Page, data: typeof entries[0]) {
  await page.click('#addNewRecordButton');
  await page.fill('#firstName', data.firstName);
  await page.fill('#lastName', data.lastName);
  await page.fill('#userEmail', data.email);
  await page.fill('#age', data.age);
  await page.fill('#salary', data.salary);
  await page.fill('#department', data.department);
  await page.click('#submit');
  console.log(`✅ ${data.role} додано: ${data.firstName} ${data.lastName}`);
}

test('Додавання факультету → групи → викладача та пошук викладача', async ({ page }) => {
  await page.goto(url);

  for (const entry of entries) {
    await addEntry(page, entry);
  }

  const teacherName = entries[2].firstName;
  await page.fill('#searchBox', teacherName);

  const teacherRow = page.locator('.rt-tr-group', { hasText: teacherName });
  await expect(teacherRow).toHaveCount(1);

  await expect(teacherRow).toContainText(entries[2].email);
  await expect(teacherRow).toContainText(entries[2].department);

  console.log(`🔍 Перевірка пройдена: знайдено ${teacherName} у таблиці.`);
});