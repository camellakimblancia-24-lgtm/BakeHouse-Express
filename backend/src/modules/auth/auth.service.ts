import { createClient } from '@supabase/supabase-js'
import { AppError } from '../../middleware/errorHandler.js'

// Fresh client without session storage, so users never share state on the server
const client = () =>
  createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false },
  })

export async function signUp(email: string, password: string, fullName: string) {
  const { data, error } = await client().auth.signUp({
    email, password, options: { data: { full_name: fullName } },
  })
  if (error) throw new AppError(400, error.message, 'SIGNUP_FAILED')
  return { user: data.user, session: data.session } // session is null if email confirmation is on
}

export async function logIn(email: string, password: string) {
  const { data, error } = await client().auth.signInWithPassword({ email, password })
  if (error) throw new AppError(401, 'Invalid email or password', 'LOGIN_FAILED')
  return { user: data.user, session: data.session }
}