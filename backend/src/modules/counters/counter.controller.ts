import type { NextFunction, Request, Response } from 'express'
import { ZodError } from 'zod'
import { AppError } from '../../middleware/errorHandler.js'
import { bakeSchema, checkoutSchema, wasteSchema } from './counter.schema.js'
import * as service from './counter.service.js'

function tokenOf(req: Request): string {
  const token = req.headers.authorization?.replace(/^Bearer\s+/i, '')
  if (!token) throw new AppError(401, 'Please log in.', 'UNAUTHENTICATED')
  return token
}

const handle =
  (fn: (req: Request) => Promise<unknown>, status = 200) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.status(status).json(await fn(req))
    } catch (err) {
      if (err instanceof ZodError) {
        return next(new AppError(400, err.issues[0]?.message ?? 'Invalid request.', 'VALIDATION'))
      }
      next(err)
    }
  }

export const getOverview = handle((req) => service.getOverview(tokenOf(req)))
export const getSales = handle((req) => service.getSales(tokenOf(req)))
export const createSale = handle((req) => service.checkout(tokenOf(req), checkoutSchema.parse(req.body)), 201)
export const getWaste = handle((req) => service.getWaste(tokenOf(req)))
export const createWaste = handle((req) => service.logWaste(tokenOf(req), wasteSchema.parse(req.body)), 201)
export const bake = handle((req) => service.bake(tokenOf(req), bakeSchema.parse(req.body)), 201)