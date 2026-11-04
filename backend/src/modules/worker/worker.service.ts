import { supabaseAdmin } from '../../lib/supabaseAdmin.js';
import type { CreateWorkerInput, DeleteWorkerInput, UpdatePasswordInput } from './worker.schema.js';

export class AdminService {
  static async registerWorker(input: CreateWorkerInput) {
    const { email, role } = input;

    // Use inviteUserByEmail to send the actual email through Supabase
    const { data, error } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
      data: { role },
      redirectTo: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/set-password`,
    });

    if (error || !data.user) {
      throw new Error(error?.message || 'Failed to send invite email');
    }

    const userId = data.user.id;

    const { error: workerInsertError } = await supabaseAdmin
      .from('workers')
      .insert([
        {
          id: userId,
          email: data.user.email,
          role: role,
          status: 'pending',
        }
      ]);

    if (workerInsertError) {
      throw new Error(`Invite sent, but failed to create worker profile: ${workerInsertError.message}`);
    }

    return {
      id: userId,
      email: data.user.email,
      role: role,
    };
  }

  static async removeWorker(input: DeleteWorkerInput) {
    const { userId } = input;

    const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);

    if (error) {
      throw new Error(error.message);
    }

    return { message: `User with ID ${userId} has been successfully deleted.` };
  }

  static async updateWorkerPassword(input: UpdatePasswordInput) {
    const { userId, password } = input;

    const { error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
      password,
    });

    if (error) {
      throw new Error(error.message);
    }

    return { message: `Password for user with ID ${userId} has been successfully updated.` };
  }
}