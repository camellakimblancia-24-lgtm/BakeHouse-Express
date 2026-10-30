import type { Response } from 'express'
import { movementSchema, settingsSchema } from './inventory.schema.js'
import * as service from './inventory.service.js'

export async function list(req: any, res: Response) {
  res.json({ data: await service.listStock(req.token) })
}

export async function lowStock(req: any, res: Response) {
  res.json({ data: await service.listLowStock(req.token) })
}

export async function movements(req: any, res: Response) {
  const ingredientId =
    typeof req.query.ingredient_id === 'string' ? req.query.ingredient_id : undefined
  res.json({ data: await service.listMovements(req.token, ingredientId) })
}

export async function addMovement(req: any, res: Response) {
  const input = movementSchema.parse(req.body)
  res.status(201).json({ data: await service.recordMovement(req.token, input) })
}

export async function updateSettings(req: any, res: Response) {
  const input = settingsSchema.parse(req.body)
  res.json({ data: await service.updateSettings(req.token, req.params.id, input) })
}