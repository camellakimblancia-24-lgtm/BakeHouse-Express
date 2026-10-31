import { z } from 'zod'

export const ingredientSchema = z.object({
  name: z.string().min(1),
  category: z.enum(['DAIRY', 'DRY_GOODS', 'PRODUCE', 'PACKAGING']).optional(),
  quantity: z.number().nonnegative(),
  unit: z.string().min(1),
  reorder_level: z.number().nonnegative().optional(),
  cost_per_unit: z.number().nonnegative().optional(),
})

export const ingredientUpdateSchema = ingredientSchema.partial()