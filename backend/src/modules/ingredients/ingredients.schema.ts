import { z } from 'zod'
import { categories } from '../../types/ingredients.js'

export const createIngredientSchema = z.object({
  name: z.string().min(1, 'Ingredient name is required.'),
  quantity: z.number().min(0, 'Quantity cannot be negative.'),
  unit: z.string().min(1, 'Unit is required.'),
  reorder_level: z.number().min(0, 'Reorder level cannot be negative.'),
  supplier_id: z.string().uuid('Invalid supplier ID format').optional().nullable(),
  cost_per_unit: z.number().min(0, 'Cost per unit cannot be negative.').optional(),
  category: z.enum(categories, {
    message: `Invalid category selected.`,
  }),
});

export const updateIngredientSchema = createIngredientSchema.partial()

export type CreateIngredientInput = z.infer<typeof createIngredientSchema>
export type UpdateIngredientInput = z.infer<typeof updateIngredientSchema>