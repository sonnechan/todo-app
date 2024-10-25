import { test, expect, request as baseRequest } from '@playwright/test';
import { APIHelper } from '../src/helpers/api_utils';

let apiHelper: APIHelper;
const username = 'admin';
const password = 'test1234';
const signUpUsername = 'sunny';
const signUpPassword = 'Test@1234';
const signUpEmail = 'test@test.com';
const updateAddress = '48/539 Test at Test Rd.';
const updatePhone = '0999999999';
const todoTitle = 'New Todo';
const todoDescription = 'This is a test todo.';

// Get API token from environment if available
const apiToken = process.env.API_TOKEN;

test.beforeAll(async ({ baseURL }) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (apiToken) {
    headers['Authorization'] = `Bearer ${apiToken}`;
    console.log('Using API_TOKEN from environment');
  }

  const request = await baseRequest.newContext({ extraHTTPHeaders: headers });
  apiHelper = new APIHelper(request, baseURL || 'http://localhost:8000/api/v1');
});

test('Login and Logout test', async () => {
  if (!apiToken) {
    const response = await apiHelper.login(username, password);
    expect(response.status()).toBe(200);
    expect(response.ok()).toBeTruthy();
    expect(apiHelper.getAccessToken()).not.toBe('');

    // Log out the account
    const logoutResponse = await apiHelper.logout();
    expect(logoutResponse.status()).toBe(200);
  } else {
    console.log('Login skipped because API_TOKEN is provided');
  }
});

test('Get Todos for logged-in user', async () => {
  if (!apiToken) {
    await apiHelper.login(username, password);
  }
  const response = await apiHelper.getTodos();
  expect(response.status()).toBe(200);
  expect(response.ok()).toBeTruthy();
  const todos = await response.json();
  console.log("Todos:", todos);
});

test('Create a new account, update profile, and delete it', async () => {
  const signupResponse = await apiHelper.signup(signUpUsername, signUpPassword, signUpEmail);
  expect(signupResponse.status()).toBe(200);

  if (!apiToken) {
    await apiHelper.login(signUpUsername, signUpPassword);
    expect(apiHelper.getAccessToken()).not.toBe('');
  }

  const profileResponse = await apiHelper.getUserProfile();
  expect(profileResponse.status()).toBe(200);
  const profileData = await profileResponse.json();
  console.log('Profile Response:', profileData);
  expect(profileData.username).toBe(signUpUsername);

  const deleteResponse = await apiHelper.deleteAccount();
  expect(deleteResponse.status()).toBe(200);
});

test('Create a new todo after login', async () => {
  if (!apiToken) {
    await apiHelper.login(username, password);
  }

  const createTodoResponse = await apiHelper.createTodo(todoTitle, todoDescription);
  expect(createTodoResponse.status()).toBe(201);
  const todoData = await createTodoResponse.json();
  console.log('Created Todo:', todoData);

  const getTodoResponse = await apiHelper.getTodos();
  expect(getTodoResponse.status()).toBe(200);

  const todos = await getTodoResponse.json();
  const verifiedTodo = todos.find(todo => todo.id === todoData.id);
  expect(verifiedTodo).not.toBeUndefined();
  expect(verifiedTodo.title).toBe(todoTitle);
  expect(verifiedTodo.description).toBe(todoDescription);
});

test('Create, verify, and delete a new todo', async () => {
  if (!apiToken) {
    await apiHelper.login(username, password);
  }

  const createTodoResponse = await apiHelper.createTodo(todoTitle, todoDescription);
  expect(createTodoResponse.status()).toBe(201);
  const todoData = await createTodoResponse.json();

  const getTodoResponse = await apiHelper.getTodoById(todoData.id);
  expect(getTodoResponse.status()).toBe(200);
  const verifiedTodo = await getTodoResponse.json();
  expect(verifiedTodo.title).toBe(todoTitle);
  expect(verifiedTodo.description).toBe(todoDescription);

  const deleteTodoResponse = await apiHelper.deleteTodo(todoData.id);
  expect(deleteTodoResponse.status()).toBe(204);

  const verifyDeletedResponse = await apiHelper.getTodoById(todoData.id);
  expect(verifyDeletedResponse.status()).toBe(404);
});

test('Update an existing todo after login', async () => {
  if (!apiToken) {
    await apiHelper.login(username, password);
  }

  const createTodoResponse = await apiHelper.createTodo('Old Todo', 'This is an old todo.');
  expect(createTodoResponse.status()).toBe(201);
  const createdTodo = await createTodoResponse.json();

  const updatedData = {
    title: 'Updated Todo',
    description: 'This is an updated test todo.',
  };
  
  const updateTodoResponse = await apiHelper.updateTodo(createdTodo.id, updatedData);
  expect(updateTodoResponse.status()).toBe(200);
  const updatedTodo = await updateTodoResponse.json();
  expect(updatedTodo.title).toBe(updatedData.title);
  expect(updatedTodo.description).toBe(updatedData.description);

  await apiHelper.deleteTodo(createdTodo.id);
});

test('Partially update an existing todo after login', async () => {
  if (!apiToken) {
    await apiHelper.login(username, password);
  }

  const createTodoResponse = await apiHelper.createTodo('Todo to be updated', 'This is a todo for partial update.');
  expect(createTodoResponse.status()).toBe(201);
  const createdTodo = await createTodoResponse.json();

  const partialUpdateData = { title: 'Partially Updated Todo' };
  const partialUpdateResponse = await apiHelper.partialUpdateTodo(createdTodo.id, partialUpdateData);
  expect(partialUpdateResponse.status()).toBe(200);

  const updatedTodo = await partialUpdateResponse.json();
  expect(updatedTodo.title).toBe(partialUpdateData.title);
  expect(updatedTodo.description).toBe('This is a todo for partial update.');

  await apiHelper.deleteTodo(createdTodo.id);
});

test('Refresh token after login', async () => {
  if (!apiToken) {
    const loginResponse = await apiHelper.login(username, password);
    
    // Explicitly assert the response to be of type APIResponse
    const loginData = await (loginResponse as any).json();  // Type assertion to avoid the error
    const refreshToken = loginData.data.refresh_token;

    const refreshResponse = await apiHelper.refreshToken(refreshToken);
    
    // Same here for the refresh response
    const refreshData = await (refreshResponse as any).json(); // Type assertion

    expect(refreshResponse.status()).toBe(200);  // Ensure the refresh was successful
    expect(refreshData.access).toBeDefined();
    expect(refreshData.access).not.toBe(loginData.data.access_token);  // Ensure the tokens are different
  } else {
    console.log('Token refresh skipped because API_TOKEN is provided');
  }
});

test('Signup with invalid data', async () => {
  const invalidSignupData = {
    username: '',
    password: 'short',
    email: 'invalid-email'
  };

  const signupResponse = await apiHelper.signup(
    invalidSignupData.username,
    invalidSignupData.password,
    invalidSignupData.email
  );

  expect(signupResponse.status()).toBe(200);
  const responseData = await signupResponse.json();
  console.log('Signup Response:', responseData);
  expect(responseData.error).toBeDefined();
  expect(responseData.error).toContain('Password must be at least 6 characters');
});

test('Cannot create todo with title longer than 120 characters', async () => {
  if (!apiToken) {
    await apiHelper.login(username, password);
  }

  const invalidTodoData = {
    title: 'A'.repeat(121),
    description: 'This is a test todo.'
  };

  const createTodoResponse = await apiHelper.createTodo(
    invalidTodoData.title,
    invalidTodoData.description
  );

  expect(createTodoResponse.status()).toBe(401);  // Expect failure due to invalid data
  const responseData = await createTodoResponse.json();
  console.log('Create Todo Response:', responseData);
  expect(responseData.title).toBeDefined();
  expect(responseData.title[0]).toContain('Ensure this field has no more than 120 characters.');
});
