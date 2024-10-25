import { APIRequestContext } from '@playwright/test';

export class APIHelper {
  private accessToken = process.env.API_TOKEN || ''; // Use API_TOKEN from env if available

  constructor(
    private readonly request: APIRequestContext,
    private readonly baseURL: string
  ) {}

  private getHeaders() {
    return {
      'Content-Type': 'application/json',
      ...(this.accessToken && { 'Authorization': `Bearer ${this.accessToken}` }),
    };
  }

  async login(username: string, password: string) {
    if (this.accessToken) {
      // If API_TOKEN is set in the environment, skip login
      console.log('Using API_TOKEN from environment, skipping login.');
      return { status: () => 200, ok: () => true }; // Mock a successful login response
    }

    const response = await this.request.post(`${this.baseURL}/accounts/login`, {
      headers: { 'Content-Type': 'application/json' },
      data: { username, password },
    });

    const data = await response.json();
    console.log("Login Response:", data); // Debug log
  
    if (data.data?.access_token) {
      this.accessToken = data.data.access_token; // Update to access the correct path
    } else {
      console.error("Access token not found in response.");
    }
    return response;
  }

  async createTodo(title: string, description: string) {
    const response = await this.request.post(`${this.baseURL}/todos/`, {
      headers: this.getHeaders(),
      data: { title, description },
    });
    return response;
  }

  async getTodos() {
    const response = await this.request.get(`${this.baseURL}/todos/`, {
      headers: this.getHeaders(),
    });
    return response;
  }

  async deleteTodo(id: number) {
    return await this.request.delete(`${this.baseURL}/todos/${id}/`, {
      headers: this.getHeaders(),
    });
  }

  async signup(username: string, password: string, email: string) {
    return await this.request.post(`${this.baseURL}/accounts/signup`, {
      headers: { 'Content-Type': 'application/json' },
      data: { username, password, email },
    });
  }
  
  async deleteAccount() {
    return await this.request.delete(`${this.baseURL}/accounts/delete`, {
      headers: this.getHeaders(),
    });
  }

  async logout() {
    return await this.request.post(`${this.baseURL}/accounts/logout`, {
      headers: this.getHeaders(),
    });
  }

  async getUserProfile() {
    return await this.request.get(`${this.baseURL}/profile/user`, {
      headers: this.getHeaders(),
    });
  }

  async updateUserProfile({ address, phone }: { address: string; phone: string }) {
    try {
      const response = await this.request.put(`${this.baseURL}/profile/update`, {
        data: { address, phone },
        headers: {
          'Authorization': `Bearer ${this.getAccessToken()}`,
        },
      });
  
      if (response.status() !== 200) {
        const errorResponse = await response.json(); // Log error details if status is not 200
        console.log('Unexpected response:', errorResponse);
        throw new Error(`Update failed: ${errorResponse.detail || 'Unknown error'}`);
      }
  
      return response;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw new Error('Something went wrong when updating profile');
    }
  }
  

  async getTodoById(id: number) {
    return await this.request.get(`${this.baseURL}/todos/${id}/`, {
      headers: this.getHeaders(),
    });
  }

  async updateTodo(id: number, data: { title: string; description: string }) {
    return await this.request.put(`${this.baseURL}/todos/${id}/`, {
      headers: this.getHeaders(),
      data: data,
    });
  }

  async partialUpdateTodo(id: number, data: { title?: string; description?: string }) {
    return await this.request.patch(`${this.baseURL}/todos/${id}/`, {
      headers: this.getHeaders(),
      data: data,
    });
  }

  async refreshToken(refresh: string) {
    return await this.request.post(`${this.baseURL}/token/refresh/`, {
      headers: { 'Content-Type': 'application/json' },
      data: { refresh },
    });
  }

  getAccessToken() {
    return this.accessToken;
  }
}
