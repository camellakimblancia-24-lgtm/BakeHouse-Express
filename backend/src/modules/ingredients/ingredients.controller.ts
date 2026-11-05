import type { Response } from 'express'
import { ingredientSchema, updateIngredientSchema } from './ingredients.schema.js'
import { IngredientService } from './ingredients.service.js'
import * as service from './ingredients.service.js'

export async function list(req: any, res: Response) {
  try {
    const data = await service.IngredientService.getIngredients(req.token)
    return res.status(200).json({ success: true, data })
  } catch (err: unknown) {
    return res.status(400).json({ success: false, message: (err as Error).message })
  }
}

export async function create(req: any, res: Response) {
  try {
    const validatedData = ingredientSchema.parse(req.body)
    const data = await service.IngredientService.createIngredient(req.token, validatedData)
    return res.status(201).json({
      success: true,
      message: `Ingredient ${data.name} created successfully.`,
      data,
    })
  } catch (err: unknown) {
    return res.status(400).json({ success: false, message: (err as Error).message })
  }
}

export async function update(req: any, res: Response) {
  try {
    const validatedData = updateIngredientSchema.parse(req.body)
    const data = await service.IngredientService.updateIngredient(req.token, req.params.id, validatedData)
    return res.status(200).json({
      success: true,
      message: `Ingredient ${data.name} updated successfully.`,
      data,
    })
  } catch (err: unknown) {
    return res.status(400).json({ success: false, message: (err as Error).message })
  }
}

export async function remove(req: any, res: Response) {
  try {
    await service.IngredientService.deleteIngredient(req.token, req.params.id)
    return res.status(200).json({ success: true, message: 'Ingredient deleted successfully.' })
  } catch (err: unknown) {
    return res.status(400).json({ success: false, message: (err as Error).message })
  }
}