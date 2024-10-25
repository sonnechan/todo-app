import { test, expect, type Page } from '@playwright/test';

const selectors = {
  loginPageTitle: 'Log in with your credentials',
  usernameInput: '#username',
  passwordInput: '#password',
  emailInput: '#email',
  confirmPasswordInput: '#repassword',
  loginButton: 'button[name="Log in"]',
  signUpLink: 'link[name="Sign up"]',
  signUpButton: 'button[name="Sign up"]'
} as const;

export async function login(
  page: Page,
  baseURL: string, 
  username: string, 
  password: string
): Promise<void> {
  
  const loginPageURL = `${baseURL}/auth/login`;

  await page.goto(loginPageURL);
  await page.getByText(selectors.loginPageTitle).isVisible();
  await page.fill(selectors.usernameInput, username);
  await page.fill(selectors.passwordInput, password);
  // when filled the password the focus is still in the password field
  // it caused the Log in button to become inaccessible
  // Therefore, I add line number 14 to make it out of focus
  await page.getByText(selectors.loginPageTitle).click();
  await page.getByRole('button', { name: 'Log in' }).click();

}

export async function signUp(
  page: Page, 
  baseURL: string, 
  username: string, 
  email: string, 
  password:string, 
  confirmPassword: string 
): Promise<void> {

  const loginPageURL = `${baseURL}/auth/login`;

  await page.goto(loginPageURL);
  await page.getByText(selectors.loginPageTitle).isVisible();
  await page.getByRole('link', { name: 'Sign up' }).click();
  await page.getByRole('button', { name: 'Sign up' }).isDisabled();

  await page.fill(selectors.usernameInput, username);
  await page.fill(selectors.emailInput, email);
  await page.fill(selectors.passwordInput, password);
  await verifyPasswordFieldType(page, selectors.passwordInput);
  await page.fill(selectors.confirmPasswordInput, confirmPassword);
  await verifyPasswordFieldType(page, selectors.confirmPasswordInput);

}

//utils 
export async function verifyPasswordFieldType(
  page: Page, 
  fieldSelector: string
): Promise<void> {
  
  const fieldType = await page.getAttribute(fieldSelector, 'type');
  expect(fieldType).toBe('password');

}

export async function verifyPasswordUnmask(
  page: Page, 
  passwordFieldSelector: string
): Promise<void> {

  let fieldType = await page.getAttribute(passwordFieldSelector, 'type');
  expect(fieldType).toBe('password');

  // Click the unmask button
  await page.locator(passwordFieldSelector).locator('..').getByLabel('toggle password visibility').click();
  

  // Verify the password field type is now 'text'
  fieldType = await page.getAttribute(passwordFieldSelector, 'type');
  expect(fieldType).toBe('text');
}

// test('test', async ({ page }) => {
//   await page.goto('http://localhost:3000/auth/login');
//   await page.locator('#username').click();
//   await page.locator('#username').fill('admin');
//   await page.locator('#username').press('Tab');
//   await page.locator('#password').fill('test1234');
//   await page.locator('div').filter({ hasText: /^Log in$/ }).click();
//   await page.getByRole('button', { name: 'Log in' }).click();
//   await page.locator('#title').click();
//   await page.locator('#title').fill('title hello');
//   await page.locator('#description').click();
//   await page.locator('#description').fill('description');
//   await page.locator('#description').click();
//   await page.locator('#description').fill('description type');
//   await page.getByRole('button', { name: 'Add todo' }).click();
//   await page.locator('li').filter({ hasText: 'title hello' }).getByRole('checkbox').check();
//   await page.locator('li').filter({ hasText: 'title hello' }).getByLabel('delete').click();
//   await page.getByRole('button', { name: 'Cancel' }).click();
//   await page.locator('li').filter({ hasText: 'title hello' }).getByLabel('delete').click();
//   await page.locator('div').filter({ hasText: /^Delete todo$/ }).click();
//   await page.getByLabel('close').click();
//   await page.locator('li').filter({ hasText: 'title hello' }).getByLabel('delete').click();
//   await page.getByRole('button', { name: 'Delete' }).click();
//   await page.getByText('Log in with your credentials').click();
//   await page.getByRole('heading', { name: 'Login ID (email)' }).click();
//   await page.getByRole('heading', { name: 'Password' }).click();
//   await page.getByRole('link', { name: 'Sign up' }).click();
//   await page.getByRole('paragraph').click();
//   await page.getByRole('heading', { name: 'Username' }).click();
//   await page.locator('#username').click();
//   await page.locator('#email').click();
//   await page.locator('#password').click();
//   await page.locator('#repassword').click();
//   await page.getByRole('heading', { name: 'Please fill out this field' }).first().click();
//   await page.getByRole('heading', { name: 'Please fill out this field' }).nth(1).click();
//   await page.getByRole('heading', { name: 'Please fill out this field' }).nth(2).click();
//   await page.getByRole('heading', { name: 'Please fill out this field' }).nth(3).click();
//   await page.getByRole('link', { name: 'Already signed up? Go to login' }).click();
// });