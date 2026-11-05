import { createClient } from '@supabase/supabase-js'
import { AppError } from '../../middleware/errorHandler.js'
import type { LoginInput, CreateUserInput, UpdateUserInput } from './auth.schema.js'

const client = () =>
  createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false },
  })

const admin = () =>
  createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false },
  })

export class AuthService {

  static async login(input: LoginInput) {
    const { email, password } = input;

    const { data, error } = await client().auth.signInWithPassword({
      email,
      password
    });

    if (error || !data.session) {
      throw new Error(error?.message || 'Invalid email or password');
    }

    return {
      session: data.session,
      user: {
        id: data.user.id,
        email: data.user.email,
        role: data.user.user_metadata?.role ?? null,
        first_name: data.user.user_metadata?.first_name ?? null,
        last_name: data.user.user_metadata?.last_name ?? null,
      },
    };
  }

  static async createUser(input: CreateUserInput) {
    const { email, password, role, first_name, last_name } = input;

    const { data, error } = await admin().auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { role, first_name, last_name },
    });

    if (error || !data.user) {
      throw new Error(error?.message || 'Failed to create user');
    }

    return {
      id: data.user.id,
      email: data.user.email,
      role,
      first_name,
      last_name,
      createdAt: data.user.created_at,
    };
  }

  static async getAllUsers() {
    const { data: { users }, error } = await admin().auth.admin.listUsers();

    if (error) {
      throw new Error(error.message);
    }

    return users.map(user => ({
      id: user.id,
      email: user.email,
      role: user.user_metadata?.role ?? null,
      first_name: user.user_metadata?.first_name ?? null,
      last_name: user.user_metadata?.last_name ?? null,
      createdAt: user.created_at,
    }));
  }

  static async getUserById(userId: string) {
    const { data: { user }, error } = await admin().auth.admin.getUserById(userId);

    if (error || !user) {
      throw new Error(error?.message || 'User not found');
    }

    return {
      id: user.id,
      email: user.email,
      role: user.user_metadata?.role ?? null,
      first_name: user.user_metadata?.first_name ?? null,
      last_name: user.user_metadata?.last_name ?? null,
      createdAt: user.created_at,
    };
  }

  static async updateUser(userId: string, input: UpdateUserInput) {
    const { password, role, first_name, last_name } = input;

    const { data: { user: currentUser } } = await admin().auth.admin.getUserById(userId);

    const updatedMetadata = {
      ...currentUser?.user_metadata,
      ...(role && { role }),
      ...(first_name && { first_name }),
      ...(last_name && { last_name }),
    };

    const { data: updatedUser, error } = await admin().auth.admin.updateUserById(userId, {
      ...(password && { password }),
      user_metadata: updatedMetadata,
    });

    if (error || !updatedUser) {
      throw new Error(error?.message || 'Failed to update user');
    }

    return {
      id: updatedUser.user.id,
      email: updatedUser.user.email,
      role: updatedUser.user.user_metadata?.role,
      first_name: updatedUser.user.user_metadata?.first_name,
      last_name: updatedUser.user.user_metadata?.last_name,
    };
  }

  static async deleteUser(userId: string) {
    const { error } = await admin().auth.admin.deleteUser(userId);

    if (error) {
      throw new Error(error.message);
    }

    return { message: `User with ID ${userId} has been successfully deleted.` };
  }
}