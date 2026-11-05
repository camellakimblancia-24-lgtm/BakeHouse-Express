import type { Response } from 'express'
import { recipeSchema, updateRecipeSchema } from './recipes.schema.js'
import * as service from './recipes.service.js'

export async function list(req: any, res: Response) {
  try {
    const data = await service.listRecipes(req.token)
    return res.status(200).json({ success: true, data })
  } catch (err: unknown) {
    return res.status(400).json({ success: false, message: (err as Error).message })
  }
}

export async function getOne(req: any, res: Response) {
  try {
    const data = await service.getRecipe(req.token, req.params.id)
    return res.status(200).json({ success: true, data })
  } catch (err: unknown) {
    return res.status(404).json({ success: false, message: (err as Error).message })
  }
}

export async function create(req: any, res: Response) {
  try {
    const validatedData = recipeSchema.parse(req.body)
    const data = await service.createRecipe(req.token, validatedData)
    return res.status(201).json({
      success: true,
      message: `Recipe ${data.name} created successfully.`,
      data,
    })
  } catch (err: unknown) {
    return res.status(400).json({ success: false, message: (err as Error).message })
  }
}

export async function update(req: any, res: Response) {
  try {
    const validatedData = updateRecipeSchema.parse(req.body)
    const data = await service.updateRecipe(req.token, req.params.id, validatedData)
    return res.status(200).json({
      success: true,
      message: `Recipe ${data.name} updated successfully.`,
      data,
    })
  } catch (err: unknown) {
    return res.status(400).json({ success: false, message: (err as Error).message })
  }
}

export async function remove(req: any, res: Response) {
  try {
    await service.deleteRecipe(req.token, req.params.id)
    return res.status(200).json({ success: true, message: 'Recipe deleted successfully.' })
  } catch (err: unknown) {
    return res.status(400).json({ success: false, message: (err as Error).message })
  }
}

export async function cost(req: any, res: Response) {
  try {
    const data = await service.getRecipeCost(req.token, req.params.id)
    return res.status(200).json({ success: true, data })
  } catch (err: unknown) {
    return res.status(400).json({ success: false, message: (err as Error).message })
  }
}