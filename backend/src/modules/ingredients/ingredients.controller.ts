import type { Response } from 'express'
import { ingredientSchema, ingredientUpdateSchema } from './ingredients.schema.js'
import * as service from './ingredients.service.js'

export async function list(req: any, res: Response) {
  res.json({ data: await service.listIngredients(req.token) })
}

export async function create(req: any, res: Response) {
  const input = ingredientSchema.parse(req.body)
  res.status(201).json({ data: await service.createIngredient(req.token, input) })
}

export async function update(req: any, res: Response) {
  const input = ingredientUpdateSchema.parse(req.body)
  res.json({ data: await service.updateIngredient(req.token, req.params.id, input) })
}

export async function remove(req: any, res: Response) {
  await service.deleteIngredient(req.token, req.params.id)
  res.status(204).send()
}