import { Page, expect } from '@playwright/test';

const selectors = {
  loginPageTitle: 'Log in with your credentials',
  signUpPageTitle: 'Welcome!',
  usernameInput: '#username',
  passwordInput: '#password',
  emailInput: '#email',
  confirmPasswordInput: '#repassword',
  signUpButton: 'button[name="Sign up"]',
  todoTitle: '#title',
  todoDescription: '#description'
} as const;

export class UserFlowPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async signUp(username: string, email: string, password: string) {
    await this.page.getByRole('link', { name: 'Sign up' }).click();
    await this.page.goto('http://localhost:3000/auth/signup', { waitUntil: 'networkidle' });
    await this.page.fill(selectors.usernameInput, username);
    await this.page.fill(selectors.emailInput, email);
    await this.page.fill(selectors.passwordInput, password);
    await this.page.fill(selectors.confirmPasswordInput, password);

    await this.verifyPasswordFieldType(selectors.passwordInput);
    await this.verifyPasswordFieldType(selectors.confirmPasswordInput);

    await this.verifyPasswordUnmask(selectors.passwordInput);
    await this.verifyPasswordUnmask(selectors.confirmPasswordInput);
    
    await this.page.getByText(selectors.signUpPageTitle).click();
    await this.page.getByRole('button', { name: 'Sign up' }).click();
    await expect(this.page.getByText('ToDo List')).toBeVisible();
  }

  async logOut() {
    await this.page.getByRole('button', { name: 'User' }).click();
    await this.page.getByRole('menuitem', { name: 'Sign out' }).click();
    await this.page.getByRole('button', { name: 'Save' }).click();
    await expect(this.page.getByText(selectors.loginPageTitle)).toBeVisible();
  }

  async logIn(username: string, password: string) {
    await this.page.fill(selectors.usernameInput, username);
    await this.page.fill(selectors.passwordInput, password);
    // bug
    // when filled the password the focus is still in the password field
    // it caused the Log in button to become inaccessible
    // Therefore, I add another click to make it out of focus
    await this.page.getByText(selectors.loginPageTitle).click();
    await this.page.getByRole('button', { name: 'Log in' }).click();
    await this.page.waitForTimeout(2000);
    await expect(this.page.getByText('ToDo List')).toBeVisible();
  }

  async createTodo(title: string, description: string) {
    await this.page.fill(selectors.todoTitle, title);
    await this.page.fill(selectors.todoDescription, description);
    await this.page.getByRole('button', { name: 'Add todo' }).click();
    // await this.page.waitForSelector('.MuiCircularProgress-svg', { state: 'hidden' });
    await this.page.waitForTimeout(2000);
    await expect(this.page.getByText('Todo added successfully')).toBeVisible();
  }

  async markTodoAsDone(title: string) {
    await this.page.locator('li').filter({ hasText: title }).getByRole('checkbox').check({ force: true });
    // await this.page.locator('input[type="checkbox"].PrivateSwitchBase-input').check({ force: true });
    await this.page.waitForTimeout(1000);
    // await this.page.getByRole('checkbox').check({ force: true });
    await this.page.locator('#title').clear();
    // await this.page.locator('#title').fill(''); 
    const strikethroughText = await this.page.getByText(title);
    const isStrikethrough = await strikethroughText.evaluate((element) => 
      window.getComputedStyle(element).textDecoration.includes('line-through')
    );
    expect(isStrikethrough).toBe(true);
  }

  async unmarkTodo(title: string) {
    // await this.page.getByRole('checkbox').check({ force: false });
    // await this.page.locator('input[type="checkbox"].PrivateSwitchBase-input').check({ force: true });
    await this.page.getByText('ToDo List').click();
    await this.page.locator('li').filter({ hasText: title }).getByRole('checkbox').check({ force: false });
    await this.page.waitForTimeout(1000);
    const strikethroughText = await this.page.getByText(title);
    const isStrikethrough = await strikethroughText.evaluate((element) => 
      window.getComputedStyle(element).textDecoration.includes('line-through')
    );
    expect(isStrikethrough).toBe(false);
  }

  async deleteTodo(title: string) {
    await this.page.locator(`text=${title}`).locator('..').getByRole('button', { name: 'Delete' }).click();
    await expect(this.page.getByText(title)).not.toBeVisible();
  }

  async verifyPasswordFieldType(fieldSelector: string): Promise<void> {
    const fieldType = await this.page.getAttribute(fieldSelector, 'type');
    expect(fieldType).toBe('password');
  }

  async verifyPasswordUnmask(passwordFieldSelector: string): Promise<void> {
    let fieldType = await this.page.getAttribute(passwordFieldSelector, 'type');
    expect(fieldType).toBe('password');

    // Click the unmask button
    await this.page.locator(passwordFieldSelector).locator('..').getByLabel('toggle password visibility').click();

    // Verify the password field type is now 'text'
    fieldType = await this.page.getAttribute(passwordFieldSelector, 'type');
    expect(fieldType).toBe('text');
  }

  
}
