import { createClient } from '@supabase/supabase-js';
import { CreateWorkerInput } from './admin.schema.js';

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export class AdminService {
  static async registerWorker(input: CreateWorkerInput) {
    const { email, password, role } = input;

    // Call Supabase Auth Admin API
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
}