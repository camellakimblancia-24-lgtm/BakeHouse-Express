import { z } from 'zod'

const saleItemSchema = z.object({
  productId: z.string().uuid('Invalid product UUID.'),
  qty: z.number().int('Quantity must be a whole number.').positive('Quantity must be above 0.'),
})

export const createSaleSchema = z.object({
  items: z.array(saleItemSchema).min(1, 'The order is empty.'),
})

export const createWasteSchema = z.object({
  productId: z.string().uuid('Invalid product UUID.'),
  qty: z.number().int('Quantity must be a whole number.').positive('Quantity must be above 0.'),
  reason: z.enum(['Unsold', 'Stale', 'Damaged'], {
    message: 'Reason must be Unsold, Stale or Damaged.',
  }),
})

export const bakeSchema = z.object({
  productId: z.string().uuid('Invalid product UUID.'),
  qty: z.number().int('Quantity must be a whole number.').positive('Quantity must be above 0.'),
})


export const checkoutSchema = createSaleSchema
export const wasteSchema = createWasteSchema

export type CheckoutInput = z.infer<typeof createSaleSchema>
export type WasteInput = z.infer<typeof createWasteSchema>
export type BakeInput = z.infer<typeof bakeSchema>