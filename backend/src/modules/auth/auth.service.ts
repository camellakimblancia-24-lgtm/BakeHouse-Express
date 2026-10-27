import { createClient } from '@supabase/supabase-js'
import { AppError } from '../../middleware/errorHandler.js'

const client = () =>
  createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false },
  })

export async function logIn(email: string, password: string) {
  const { data, error } = await client().auth.signInWithPassword({ email, password })
  if (error) throw new AppError(401, 'Invalid email or password', 'LOGIN_FAILED')
  return { user: data.user, session: data.session }
}