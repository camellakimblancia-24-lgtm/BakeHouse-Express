import type { Request, Response, NextFunction } from 'express'

export class AppError extends Error {
  constructor(
    public status: number,
    message: string,
    public code?: string
  ) {
    super(message)
  }
}

export function notFound(_req: Request, res: Response) {
  res.status(404).json({ error: { message: 'Route not found', code: 'NOT_FOUND' } })
}

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  const status = err instanceof AppError ? err.status : 500
  const message = err instanceof AppError ? err.message : 'Something went wrong'

  if (status === 500) console.error(err)

  res.status(status).json({ error: { message, code: err.code ?? 'SERVER_ERROR' } })
}