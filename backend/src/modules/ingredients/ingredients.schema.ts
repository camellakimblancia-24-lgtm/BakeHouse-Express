import { z } from 'zod'
import { category } from '../../types/ingredientCategories.js'

export const ingredientSchema = z.object({
  name: z.string().min(1),
  category: z.enum(category).optional(),
  quantity: z.number().nonnegative(),
  unit: z.string().min(1),
  reorder_level: z.number().nonnegative().optional(),
  cost_per_unit: z.number().nonnegative().optional(),
})

export const createIngredientSchema = z.object({
  name: z.string().min(1, 'Name cannot be empty.'),
  category: z
    .enum(category, { message: `Category must be ${category.join(', ')}.` })
    .optional(),
  quantity: z.number().nonnegative('Quantity cannot be negative.'),
  unit: z.string().min(1, 'Unit cannot be empty.'),
  reorder_level: z.number().nonnegative('Reorder level cannot be negative.').optional(),
  cost_per_unit: z.number().nonnegative('Cost per unit cannot be negative.').optional(),
})


export const updateIngredientSchema = z.object({
  name: z.string().min(1, 'Name cannot be empty.').optional(),
  category: z
    .enum(category, { message: `Category must be ${category.join(', ')}.` })
    .optional(),
  quantity: z.number().nonnegative('Quantity cannot be negative.').optional(),
  unit: z.string().min(1, 'Unit cannot be empty.').optional(),
  reorder_level: z.number().nonnegative('Reorder level cannot be negative.').optional(),
  cost_per_unit: z.number().nonnegative('Cost per unit cannot be negative.').optional(),
})


export const ingredientIdParamSchema = z.object({
  id: z.string().uuid('Invalid ingredient UUID.'),
})


export type CreateIngredientInput = z.infer<typeof createIngredientSchema>
export type UpdateIngredientInput = z.infer<typeof updateIngredientSchema>