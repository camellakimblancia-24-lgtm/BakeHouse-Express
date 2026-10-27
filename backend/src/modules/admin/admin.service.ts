import { createClient } from '@supabase/supabase-js';
import type { CreateWorkerInput, DeleteWorkerInput } from './admin.schema.js';

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export class AdminService {
  static async registerWorker(input: CreateWorkerInput) {
    const { email, password, role } = input;

    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { role },
    });

    if (error) {
      throw new Error(error.message);
    }

    return {
      id: data.user.id,
      email: data.user.email,
      role: data.user.user_metadata.role,
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
}