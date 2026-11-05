import type { Response } from 'express'
import { ZodError } from 'zod'
import { AppError } from '../../middleware/errorHandler.js'
import { bakeSchema, checkoutSchema, wasteSchema } from './counter.schema.js'
import * as service from './counter.service.js'

function tokenOf(req: any): string {
  if (!req.token) throw new AppError(401, 'Please log in.', 'UNAUTHENTICATED')
  return req.token
}

function fail(res: Response, err: unknown) {
  if (err instanceof ZodError) {
    return res.status(400).json({ success: false, message: err.issues[0]?.message ?? 'Invalid request.' })
  }
  const e = err as { status?: number; statusCode?: number; code?: string; message: string }
  return res
    .status(e.status ?? e.statusCode ?? 400)
    .json({ success: false, message: e.message, code: e.code })
}

export const getOverview = async (req: any, res: Response) => {
  try {
    const data = await service.CounterService.getOverview(tokenOf(req))
    return res.status(200).json({ success: true, data })
  } catch (err: unknown) {
    return fail(res, err)
  }
}

export const getSales = async (req: any, res: Response) => {
  try {
    const data = await service.CounterService.getSales(tokenOf(req))
    return res.status(200).json({ success: true, data })
  } catch (err: unknown) {
    return fail(res, err)
  }
}

export const createSale = async (req: any, res: Response) => {
  try {
    const validatedData = checkoutSchema.parse(req.body)
    const data = await service.CounterService.checkout(tokenOf(req), validatedData)
    return res.status(201).json({ success: true, message: 'Sale recorded.', data })
  } catch (err: unknown) {
    return fail(res, err)
  }
}

export const getWaste = async (req: any, res: Response) => {
  try {
    const data = await service.CounterService.getWaste(tokenOf(req))
    return res.status(200).json({ success: true, data })
  } catch (err: unknown) {
    return fail(res, err)
  }
}

export const createWaste = async (req: any, res: Response) => {
  try {
    const validatedData = wasteSchema.parse(req.body)
    const data = await service.CounterService.logWaste(tokenOf(req), validatedData)
    return res.status(201).json({ success: true, message: 'Waste logged.', data })
  } catch (err: unknown) {
    return fail(res, err)
  }
}

export const bake = async (req: any, res: Response) => {
  try {
    const validatedData = bakeSchema.parse(req.body)
    const data = await service.CounterService.bake(tokenOf(req), validatedData)
    return res.status(201).json({ success: true, message: 'Stock added to the counter.', data })
  } catch (err: unknown) {
    return fail(res, err)
  }
}