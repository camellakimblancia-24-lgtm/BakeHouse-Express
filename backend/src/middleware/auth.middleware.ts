import type { Request, Response, NextFunction } from 'express'
import { supabase, supabaseForUser } from '../lib/supabaseClient.js'

export async function auth(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.replace('Bearer ', '')
  if (!token) return res.status(401).json({ error: { message: 'Missing token', code: 'NO_TOKEN' } })

  const { data, error } = await supabase.auth.getUser(token)
  if (error || !data.user)
    return res.status(401).json({ error: { message: 'Invalid or expired token', code: 'BAD_TOKEN' } })

  // Look up the role, running as the user so RLS applies
  const { data: profile } = await supabaseForUser(token)
    .from('profiles').select('role').eq('id', data.user.id).single()

  ;(req as any).user = { id: data.user.id, email: data.user.email, role: profile?.role ?? 'staff' }
  ;(req as any).token = token
  next()
}