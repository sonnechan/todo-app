async signup(username: string, password: string) {
    return await this.request.post(`${this.baseURL}/accounts/signup`, {
      headers: this.getHeaders(),
      data: { username, password }
    });
  }

  async logout() {
    return await this.request.post(`${this.baseURL}/accounts/logout`, {
      headers: this.getHeaders()
    });
  }

  async deleteAccount() {
    return await this.request.delete(`${this.baseURL}/accounts/delete`, {
      headers: this.getHeaders()
    });
  }

  // Profile management
  async getUserProfile() {
    return await this.request.get(`${this.baseURL}/profile/user`, {
      headers: this.getHeaders()
    });
  }

  async updateUserProfile(data: Record<string, any>) {
    return await this.request.put(`${this.baseURL}/profile/update`, {
      headers: this.getHeaders(),
      data
    });
  }

  // Todo management
  async createTodo(todo: TodoPayload) {
    return await this.request.post(`${this.baseURL}/todos/`, {
      headers: this.getHeaders(),
      data: todo
    });
  }

  async getTodos() {
    return await this.request.get(`${this.baseURL}/todos/`, {
      headers: this.getHeaders()
    });
  }

  async getTodo(id: number) {
    return await this.request.get(`${this.baseURL}/todos/${id}/`, {
      headers: this.getHeaders()
    });
  }

  async updateTodo(id: number, todo: TodoPayload) {
    return await this.request.put(`${this.baseURL}/todos/${id}/`, {
      headers: this.getHeaders(),
      data: todo
    });
  }

  async partialUpdateTodo(id: number, todo: Partial<TodoPayload>) {
    return await this.request.patch(`${this.baseURL}/todos/${id}/`, {
      headers: this.getHeaders(),
      data: todo
    });
  }

  async deleteTodo(id: number) {
    return await this.request.delete(`${this.baseURL}/todos/${id}/`, {
      headers: this.getHeaders()
    });
  }

  // Token refresh
  async refreshToken() {
    const response = await this.request.post(`${this.baseURL}/token/refresh/`, {
      headers: this.getHeaders(),
      data: { refresh: this.refreshTokenValue }
    });
    const data: TokenResponse = await response.json();
    this.accessToken = data.access;
    return data;
  }