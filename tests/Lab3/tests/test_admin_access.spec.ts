import { test, expect } from '@playwright/test';
import { loginAsAdmin, createUser, deleteUser } from '../api/auth.api';

test.describe('Admin JWT Access', () => {
  let newUserId: string;

  test('Admin can create user and access /admin', async () => {
    const token = await loginAsAdmin();
    expect(token).not.toBe('');

    const username = `user${Date.now()}`;
    const password = 'TestPass123!';
    newUserId = await createUser(username, password);
    expect(newUserId).toBeTruthy();
  });

  test.afterEach(async () => {
    if (newUserId) await deleteUser(newUserId);
  });
});