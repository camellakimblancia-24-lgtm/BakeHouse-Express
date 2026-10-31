import { z } from 'zod'

export const movementSchema = z
  .object({
    ingredient_id: z.string().uuid(),
    type: z.enum(['restock', 'usage', 'adjustment']),
    quantity: z.number().nonnegative(),
    note: z.string().optional(),
    supplier_id: z.string().uuid().optional(),
  })
  .refine((m) => m.type === 'adjustment' || m.quantity > 0, {
    message: 'quantity must be greater than 0',
    path: ['quantity'],
  })

export const settingsSchema = z.object({
  reorder_level: z.number().nonnegative().optional(),
  supplier_id: z.string().uuid().nullable().optional(),
})