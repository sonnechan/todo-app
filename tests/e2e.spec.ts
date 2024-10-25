// locators are not good enough to write a stable test
// there are many bugs

// The summary of this E2E is user is able to sign up, logout,
// then login again, then add todo, then check the chekbox, 
// and verify the text is strikethrough, then uncheck the checkbox, 
//-- I cannot verify strikethrough, but I still wrote it to demonstrate what I would like to do
// and uncheck is not possible, better locator will solve this problem
// and verify the text is not strikethrough, then delete todo,
// and finally delete the create account in order to reuse the same data when rerun
// I tried to use API in the UI level to delete it, but not possible.
// I can delete account in api level, but I think I did something wrong in the UI level

//todo list is also shared with all account, which shouldn't

import { test, expect, chromium, Browser, Page } from '@playwright/test';
import { UserFlowPage } from './utils';
import { APIHelper } from '../src/helpers/api_utils';

const frontendURL = 'http://localhost:3000';
const backendURL = 'http://localhost:8000/api/v1';

const selectors = {
    loginPageTitle: 'Log in with your credentials',
    usernameInput: '#username',
    passwordInput: '#password',
    emailInput: '#email',
    confirmPasswordInput: '#repassword',
    signUpButton: 'button[name="Sign up"]',
    todoTitle: '#title',
    todoDescription: '#description'
} as const;

test.describe('Complete User Flow Test', () => {
    let userFlow: UserFlowPage;
    let apiHelper: APIHelper;
    let browser: Browser;
    let page: Page;
    let username = 'testuser25';
    let email = 'testuser25@example.com';
    let password = 'TestPassword123';
    let todoTitle = 'Hello サニー';
    let todoDescription = 'description1234haha@!! あいうえお 漢字 カニ';

    test.beforeAll(async () => {
        browser = await chromium.launch();
        page = await browser.newPage();
        userFlow = new UserFlowPage(page);
        apiHelper = new APIHelper(page.request, backendURL);
        await page.goto(frontendURL);
    });

    test('User flow - Signup, Login, Todo Operations, Logout', async () => {
        await userFlow.signUp(username, email, password);
        await userFlow.logOut();
        await userFlow.logIn(username, password);
        await userFlow.createTodo(todoTitle, todoDescription);
        await userFlow.markTodoAsDone(todoTitle);
        await userFlow.unmarkTodo(todoTitle);
        await userFlow.deleteTodo(todoTitle);
    });

    test.afterAll(async () => {
        const token = apiHelper.getAccessToken();
        if (!token) {
            console.error("No valid access token available.");
        } else {
            try {
                const deleteResponse = await apiHelper.deleteAccount();
                expect(deleteResponse.status()).toBe(200); // Expect successful account deletion
                
            } catch (error) {
                console.error("Error during account deletion:", error);
            }
        }
        await browser.close();
    });
});
