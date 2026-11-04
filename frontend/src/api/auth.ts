import type { LoginCredentials, CreateUserPayload, UpdateUserPayload, UserResponse } from '../types/auth'

const API_URL = 'http://localhost:3000'

export const authApi = {
  async login(credentials: LoginCredentials) {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });

    console.log(response)

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    if (data.session?.access_token) {
      localStorage.setItem('bakehouse_auth_token', data.session.access_token);
    }

    return data;
  },

  async getUsers(token: string): Promise<UserResponse[]> {
    const response = await fetch(`${API_URL}/auth/users`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch users');
    }

    return data;
  },

  async createUser(token: string, payload: CreateUserPayload): Promise<UserResponse> {
    const response = await fetch(`${API_URL}/auth/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to create user');
    }

    return data;
  },

  async updateUser(token: string, userId: string, payload: UpdateUserPayload): Promise<UserResponse> {
    const response = await fetch(`${API_URL}/auth/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to update user');
    }

    return data;
  },

  async deleteUser(token: string, userId: string): Promise<{ message: string }> {
    const response = await fetch(`${API_URL}/auth/users/${userId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to delete user');
    }

    return data;
  }
};