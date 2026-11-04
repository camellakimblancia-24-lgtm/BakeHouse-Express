import type { Response } from 'express'
import { recipeSchema, recipeUpdateSchema } from './recipes.schema.js'
import * as service from './recipes.service.js'

export async function list(req: any, res: Response) {
  res.json({ data: await service.listRecipes(req.token) })
}

export async function getOne(req: any, res: Response) {
  res.json({ data: await service.getRecipe(req.token, req.params.id) })
}

export async function create(req: any, res: Response) {
  const input = recipeSchema.parse(req.body)
  res.status(201).json({ data: await service.createRecipe(req.token, input) })
}

export async function update(req: any, res: Response) {
  const input = recipeUpdateSchema.parse(req.body)
  res.json({ data: await service.updateRecipe(req.token, req.params.id, input) })
}

export async function remove(req: any, res: Response) {
  await service.deleteRecipe(req.token, req.params.id)
  res.status(204).send()
}

export async function cost(req: any, res: Response) {
  res.json({ data: await service.getRecipeCost(req.token, req.params.id) })
}

