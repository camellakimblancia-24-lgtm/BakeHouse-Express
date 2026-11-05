import { z } from 'zod'

const orderItemSchema = z.object({
  product_id: z.string().uuid('Invalid product UUID.'),
  quantity: z.number().int('Quantity must be a whole number.').positive('Quantity must be above 0.'),
})

export const createOrderSchema = z.object({
  customer_name: z.string().min(1, 'Customer name cannot be empty.'),
  notes: z.string().optional(),
  items: z.array(orderItemSchema).min(1, 'An order needs at least one item.'),
})

export const updateOrderSchema = z.object({
  customer_name: z.string().min(1, 'Customer name cannot be empty.').optional(),
  notes: z.string().optional(),
  status: z
    .enum(['pending', 'baking', 'ready', 'completed', 'cancelled'], {
      message: 'Status must be pending, baking, ready, completed or cancelled.',
    })
    .optional(),
})

export const orderSchema = createOrderSchema

export const orderIdParamSchema = z.object({
  id: z.string().uuid('Invalid order UUID.'),
})

export type CreateOrderInput = z.infer<typeof createOrderSchema>
export type UpdateOrderInput = z.infer<typeof updateOrderSchema>