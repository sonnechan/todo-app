import { test, expect } from '@playwright/test';
import { login } from './utils';

const baseURL = 'http://localhost:3000'; // This could be replaced with a staging/production URL
const username = 'admin';
const password = 'test1234';

test('login', async ({ page }) => {
    await login(page, baseURL, username, password);
    await page.getByText('ToDo List').isVisible();

});

test('signUp', async ({ page }) => {
    await login(page, baseURL, username, password);
    await page.getByText('ToDo List').isVisible();

});