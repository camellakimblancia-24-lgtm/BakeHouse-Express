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

// The shape the frontend sends: a signed change plus a reason
const frontendMovement = z
  .object({
    ingredient_id: z.string().uuid(),
    change: z.number().refine((n) => n !== 0, 'change cannot be 0'),
    reason: z.enum(['delivery', 'spoiled']).optional(),
    user: z.string().optional(),
  })
  .transform((m) => ({
    ingredient_id: m.ingredient_id,
    type: (m.change > 0 ? 'restock' : 'usage') as 'restock' | 'usage',
    quantity: Math.abs(m.change),
    note: m.reason,
    supplier_id: undefined as string | undefined,
  }))

export function parseMovement(body: unknown) {
  if (body && typeof body === 'object' && 'change' in body)
    return frontendMovement.parse(body)
  return movementSchema.parse(body)
}

export const settingsSchema = z.object({
  reorder_level: z.number().nonnegative().optional(),
  supplier_id: z.string().uuid().nullable().optional(),
})