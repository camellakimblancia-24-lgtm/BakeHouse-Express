import type { Response } from 'express'
import * as service from './inventory.service.js'
import { parseMovement, settingsSchema } from './inventory.schema.js'

export async function list(req: any, res: Response) {
  try {
    const data = await service.listStock(req.token)
    return res.status(200).json({ success: true, data })
  } catch (err: unknown) {
    return res.status(400).json({ success: false, message: (err as Error).message })
  }
}

export async function lowStock(req: any, res: Response) {
  try {
    const data = await service.listLowStock(req.token)
    return res.status(200).json({ success: true, data })
  } catch (err: unknown) {
    return res.status(400).json({ success: false, message: (err as Error).message })
  }
}

export async function movements(req: any, res: Response) {
  try {
    const ingredientId =
      typeof req.query.ingredient_id === 'string' ? req.query.ingredient_id : undefined
    const data = await service.listMovements(req.token, ingredientId)
    return res.status(200).json({ success: true, data })
  } catch (err: unknown) {
    return res.status(400).json({ success: false, message: (err as Error).message })
  }
}

export async function addMovement(req: any, res: Response) {
  try {
    const validatedData = parseMovement(req.body)
    const data = await service.recordMovement(req.token, validatedData)
    return res.status(201).json({
      success: true,
      message: 'Stock movement recorded successfully.',
      data,
    })
  } catch (err: unknown) {
    return res.status(400).json({ success: false, message: (err as Error).message })
  }
}

export async function updateSettings(req: any, res: Response) {
  try {
    const validatedData = settingsSchema.parse(req.body)
    const data = await service.updateSettings(req.token, req.params.id, validatedData)
    return res.status(200).json({
      success: true,
      message: 'Inventory settings updated successfully.',
      data,
    })
  } catch (err: unknown) {
    return res.status(400).json({ success: false, message: (err as Error).message })
  }
}

export async function deduct(req: any, res: Response) {
  try {
    const data = await service.deductStockForOrder(req.token, req.params.orderId)
    return res.status(200).json({
      success: true,
      message: 'Ingredient stock deducted for the order.',
      data,
    })
  } catch (err: unknown) {
    return res.status(400).json({ success: false, message: (err as Error).message })
  }
}