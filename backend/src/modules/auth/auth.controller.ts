import type { Request, Response } from 'express'
import { loginSchema } from './auth.schema.js'
import * as service from './auth.service.js'

export async function login(req: Request, res: Response) {
  const { email, password } = loginSchema.parse(req.body)
  res.json({ data: await service.logIn(email, password) })
}

export const me = (req: any, res: Response) => res.json({ data: req.user })