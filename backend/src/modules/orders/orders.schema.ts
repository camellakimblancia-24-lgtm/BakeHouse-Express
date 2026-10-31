import { z } from 'zod'

const itemSchema = z.object({
  product_id: z.string().uuid(),
  quantity: z.number().int().positive(),
})

export const orderSchema = z.object({
  customer_name: z.string().min(1),
  notes: z.string().optional(),
  items: z.array(itemSchema).min(1),
})

export const orderUpdateSchema = z.object({
  customer_name: z.string().min(1).optional(),
  notes: z.string().optional(),
  status: z.enum(['pending', 'baking', 'ready', 'completed', 'cancelled']).optional(),
})