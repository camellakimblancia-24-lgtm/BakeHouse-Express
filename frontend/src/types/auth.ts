import type { Role } from './roles'

export interface LoginCredentials {
  email: string
  password: string
}

export interface CreateUserPayload {
  email: string;
  password: string;
  role: Role;
  first_name: string;
  last_name: string;
}

export interface UpdateUserPayload {
  password?: string;
  role?: Role;
  first_name?: string;
  last_name?: string;
}

export interface UserResponse {
  id: string;
  email: string;
  role: Role;
  first_name: string;
  last_name: string;
  created_at?: string;
}