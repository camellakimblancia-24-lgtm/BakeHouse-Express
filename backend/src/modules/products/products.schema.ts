import { z } from 'zod'

export const productSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  price: z.number().nonnegative(),
  category: z.string().optional(),
  recipe_id: z.string().uuid().nullable().optional(),
  is_available: z.boolean().optional(),
})

export const productUpdateSchema = productSchema.partial()