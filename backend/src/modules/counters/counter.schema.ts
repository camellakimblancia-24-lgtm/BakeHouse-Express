import { z } from 'zod'

export const checkoutSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string().uuid(),
        qty: z.number().int().positive(),
      }),
    )
    .min(1, 'The order is empty.'),
})

export const wasteSchema = z.object({
  productId: z.string().uuid(),
  qty: z.number().int().positive(),
  reason: z.enum(['Unsold', 'Stale', 'Damaged']),
})

export const bakeSchema = z.object({
  productId: z.string().uuid(),
  qty: z.number().int().positive(),
})

export type CheckoutInput = z.infer<typeof checkoutSchema>
export type WasteInput = z.infer<typeof wasteSchema>
export type BakeInput = z.infer<typeof bakeSchema>