import type { Response } from 'express'
import { ingredientSchema } from './ingredients.schema.js'
import * as service from './ingredients.service.js'

export async function list(req: any, res: Response) {
  res.json({ data: await service.listIngredients(req.token) })
}

export async function create(req: any, res: Response) {
  const input = ingredientSchema.parse(req.body)
  res.status(201).json({ data: await service.createIngredient(req.token, input) })
}