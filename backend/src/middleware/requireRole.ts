export const requireRole = (...roles: string[]) => (req: any, res: any, next: any) => {
  if (!roles.includes(req.user?.role))
    return res.status(403).json({ error: { message: 'Not allowed', code: 'FORBIDDEN' } })
  next()
}