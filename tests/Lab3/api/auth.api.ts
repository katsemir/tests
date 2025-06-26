import { request } from '@playwright/test';
import { ENV } from '../utils/env';

let tokens: Record<string, string> = {};

export async function loginAsAdmin(): Promise<string> {
  const context = await request.newContext();
  const res = await context.post(`${ENV.BASE_URL}/Account/v1/GenerateToken`, {
    data: {
      userName: ENV.ADMIN_USERNAME,
      password: ENV.ADMIN_PASSWORD
    }
  });

  const json = await res.json();
  if (!json.token) throw new Error('Token not received');
  tokens['admin'] = json.token;
  return json.token;
}

export async function createUser(username: string, password: string): Promise<string> {
  const context = await request.newContext();
  const res = await context.post(`${ENV.BASE_URL}/Account/v1/User`, {
    data: { userName: username, password },
    headers: { Authorization: `Bearer ${tokens['admin']}` }
  });

  const json = await res.json();
  if (!json.userID) throw new Error('User creation failed');
  tokens[username] = json.token || '';
  return json.userID;
}

export async function deleteUser(userId: string): Promise<void> {
  const context = await request.newContext();
  await context.delete(`${ENV.BASE_URL}/Account/v1/User/${userId}`, {
    headers: { Authorization: `Bearer ${tokens['admin']}` }
  });
}