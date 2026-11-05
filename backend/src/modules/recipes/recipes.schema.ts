import { z } from 'zod'

const recipeIngredientSchema = z.object({
  ingredient_id: z.string().uuid('Invalid ingredient UUID.'),
  quantity: z.number().positive('Quantity must be above 0.'),
  unit: z.string().min(1, 'Unit cannot be empty.'),
})

export const createRecipeSchema = z.object({
  name: z.string().min(1, 'Name cannot be empty.'),
  description: z.string().optional(),
  servings: z.number().int('Servings must be a whole number.').positive('Servings must be above 0.'),
  instructions: z.string().optional(),
  ingredients: z.array(recipeIngredientSchema).default([]),
})

export const updateRecipeSchema = z.object({
  name: z.string().min(1, 'Name cannot be empty.').optional(),
  description: z.string().optional(),
  servings: z.number().int('Servings must be a whole number.').positive('Servings must be above 0.').optional(),
  instructions: z.string().optional(),
  ingredients: z.array(recipeIngredientSchema).optional(),
})

// Keeps your existing controller import working.
export const recipeSchema = createRecipeSchema

export const recipeIdParamSchema = z.object({
  id: z.string().uuid('Invalid recipe UUID.'),
})

export type CreateRecipeInput = z.infer<typeof createRecipeSchema>
export type UpdateRecipeInput = z.infer<typeof updateRecipeSchema>