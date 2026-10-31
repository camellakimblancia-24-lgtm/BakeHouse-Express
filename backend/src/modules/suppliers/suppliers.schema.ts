import { z } from 'zod'

export const supplierSchema = z.object({
  name: z.string().min(1),
  contact_person: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  address: z.string().optional(),
})

export const supplierUpdateSchema = supplierSchema.partial()