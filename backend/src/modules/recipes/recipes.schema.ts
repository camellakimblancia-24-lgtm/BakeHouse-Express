import { z } from 'zod'

const itemSchema = z.object({
  ingredient_id: z.string().uuid(),
  quantity: z.number().positive(),
  unit: z.string().min(1),
})

export const recipeSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  servings: z.number().int().positive(),
  instructions: z.string().optional(),
  ingredients: z.array(itemSchema).default([]),
})

export const recipeUpdateSchema = recipeSchema.partial()
