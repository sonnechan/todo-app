import { test, expect, request as baseRequest, APIResponse } from '@playwright/test';
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
  // Step 1: Sign up a new user
  const signupResponse = await apiHelper.signup(signUpUsername, signUpPassword, signUpEmail);
  expect(signupResponse.status()).toBe(200);

  // Step 2: Log in with the new account
  await apiHelper.login(signUpUsername, signUpPassword);
  expect(apiHelper.getAccessToken()).not.toBe('');

  // Step 3: Get the user's profile and verify
  const profileResponse = await apiHelper.getUserProfile();
  const profileData = await profileResponse.json();
  console.log('Profile Response Structure:', JSON.stringify(profileData, null, 2));

  // Attempt to retrieve the username from possible locations within the profile response
  const retrievedUsername = profileData.username || profileData.profile?.username;
  
  if (retrievedUsername) {
    expect(retrievedUsername).toBe(signUpUsername);
  } else {
    // Log the complete profile data if username retrieval fails for troubleshooting
    console.error("Username not found in profile response:", JSON.stringify(profileData, null, 2));
    throw new Error("Username is not found in profile response");
  }

  // Step 4: Update user profile with address and phone
  const updateData = { address: updateAddress, phone: updatePhone };
  console.log('Updating profile with:', updateData);

  const updateResponse = await apiHelper.updateUserProfile(updateData);
  const updateResponseData = await updateResponse.json();
  console.log('Update Response:', updateResponseData);

  expect(updateResponse.status()).toBe(200); // Expect successful update

  // Step 5: Delete the account
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
    // Log in to get initial tokens
    const loginResponse = await apiHelper.login(username, password) as APIResponse;  // Ensure it's typed as APIResponse

    // Check if loginResponse is valid and log it
    console.log("Login Response:", loginResponse);

    // Check if loginResponse is an APIResponse
    if (!loginResponse || typeof loginResponse.status !== 'function') {
      throw new Error("Login response is not a valid API response. Received: " + JSON.stringify(loginResponse));
    }

    // Ensure the status is 200 before parsing the response
    expect(loginResponse.status()).toBe(200);

    // Now, safely parse the response
    const loginData = await loginResponse.json();  
    console.log("Login Response Data:", loginData);  // Log for debugging
    
    const refreshToken = loginData.data?.refresh_token;
    if (!refreshToken) {
      throw new Error("Refresh token not found in login response.");
    }

    // Attempt to refresh the token
    const refreshResponse = await apiHelper.refreshToken(refreshToken) as APIResponse;  // Ensure it's typed as APIResponse

    // Log and ensure refreshResponse is valid
    console.log("Refresh Response:", refreshResponse);

    if (!refreshResponse || typeof refreshResponse.status !== 'function') {
      throw new Error("Refresh response is not valid. Received: " + JSON.stringify(refreshResponse));
    }

    // Safely check the refresh response
    expect(refreshResponse.status()).toBe(200);
    
    const refreshData = await refreshResponse.json();  // json() method should work correctly now
    console.log("Refresh Response Data:", refreshData);  // Log for debugging

    expect(refreshData.access).toBeDefined();
    expect(refreshData.access).not.toBe(loginData.data.access_token);  // Ensure the new token is different
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
    title: 'A'.repeat(121),  // Title exceeds the 120-character limit
    description: 'This is a test todo with a long title.'
  };

  const createTodoResponse = await apiHelper.createTodo(
    invalidTodoData.title,
    invalidTodoData.description
  );

  // Expect 400 Bad Request for invalid data, as title is too long
  expect(createTodoResponse.status()).toBe(400);  // Adjust to expect 400 instead of 401

  const responseData = await createTodoResponse.json();
  console.log('Create Todo Response:', responseData);

  // Validate that the error message is about the title being too long
  expect(responseData.title).toBeDefined();  // Check that there's an error message for 'title'
  expect(responseData.title[0]).toContain('Ensure this field has no more than 120 characters.');
});

