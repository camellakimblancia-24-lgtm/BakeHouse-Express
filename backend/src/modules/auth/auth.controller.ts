import type { Request, Response } from 'express'
import { loginSchema } from './auth.schema.js'
import * as service from './auth.service.js'
import { supabase } from '../../lib/supabaseClient.js'

export async function login(req: Request, res: Response) {
  const { email, password } = loginSchema.parse(req.body)
  res.json({ data: await service.logIn(email, password) })
}

export async function me(req: any, res: Response) {
  try {

    const userId = req.user.id;

    const { data: worker, error } = await supabase
    .from('workers')
    .select('id, email, role, status, first_name, last_name')
    .eq('id', userId)
    .single();

    if (error || !worker) {
      return res.status(404).json({ error: 'Worker not found' });
    }

    res.json({ data: worker });

  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}