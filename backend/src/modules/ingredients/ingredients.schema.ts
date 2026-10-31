import { z } from 'zod'

export const ingredientSchema = z.object({
  name: z.string().min(1),
  quantity: z.number().nonnegative(),
  unit: z.string().min(1),
  cost_per_unit: z.number().nonnegative().optional(),
})

export const ingredientUpdateSchema = ingredientSchema.partial()