import { supabaseAdmin } from '../../lib/supabaseAdmin.js';
import type { CreateWorkerInput, DeleteWorkerInput, UpdatePasswordInput } from './admin.schema.js';

export class AdminService {
  static async registerWorker(input: CreateWorkerInput) {
    const { email, role } = input;

    const { data, error } = await supabaseAdmin.auth.admin.generateLink({
      type: 'invite',
      email,
      options: {
        data: { role },
        redirectTo: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/update-password`,
      },
    });

    if (error || !data.user) {
      throw new Error(error?.message || 'Failed to generate invite link');
    }

    const userId = data.user.id;
    const actionLink = data.properties?.action_link;

    const { error: workerInsertError } = await supabaseAdmin
    .from('workers')
      .insert([
        {
          id: userId,
          email: data.user.email,
          role: role,
          status: 'pending',
        }
      ])

      if (workerInsertError) {
        throw new Error(`Invite sent, but failed to create worker profile: ${workerInsertError.message}`);
    }

    return {
      id: userId,
      email: data.user.email,
      role: role,
      actionLink,
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