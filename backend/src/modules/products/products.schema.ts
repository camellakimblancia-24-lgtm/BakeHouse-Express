import { z } from 'zod'

export const productSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  price: z.number().nonnegative(),
  category: z.string().optional(),
  recipe_id: z.string().uuid().nullable().optional(),
  is_available: z.boolean().optional(),
})

export const createProductSchema = z.object({
  name: z.string().min(1, 'Name cannot be empty.'),
  description: z.string().optional(),
  price: z.number().nonnegative('Price cannot be negative.'),
  category: z.string().optional(),
  recipe_id: z.string().uuid('Invalid recipe UUID.').nullable().optional(),
  is_available: z.boolean().optional(),
})

export const updateProductSchema = z.object({
  name: z.string().min(1, 'Name cannot be empty.').optional(),
  description: z.string().optional(),
  price: z.number().nonnegative('Price cannot be negative.').optional(),
  category: z.string().optional(),
  recipe_id: z.string().uuid('Invalid recipe UUID.').nullable().optional(),
  is_available: z.boolean().optional(),
})


export const productIdParamSchema = z.object({
  id: z.string().uuid('Invalid product UUID.'),
})

export type CreateProductInput = z.infer<typeof createProductSchema>
export type UpdateProductInput = z.infer<typeof updateProductSchema>

