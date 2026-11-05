import { z } from 'zod'

export const supplierSchema = z.object({
  name: z.string().min(1),
  contact_person: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  address: z.string().optional(),
})

export const createSupplierSchema = z.object({
  name: z.string().min(1, 'Supplier name cannot be empty.'),
  contact_person: z.string().min(1, 'Contact person cannot be empty.').optional(),
  phone: z.string().min(1, 'Phone cannot be empty.').optional(),
  email: z.string().email('Invalid email address format.').optional(),
  address: z.string().min(1, 'Address cannot be empty.').optional(),
});

export const updateSupplierSchema = z.object({
  name: z.string().min(1, 'Supplier name cannot be empty').optional(),
  contact_person: z.string().min(1, 'Contact person cannot be empty').optional(),
  phone: z.string().min(1, 'Phone cannot be empty').optional(),
  email: z.string().email('Invalid email address format').optional(),
  address: z.string().min(1, 'Address cannot be empty').optional(),
});

export const supplierIdParamSchema = z.object({
  id: z.string().uuid('Invalid supplier UUID'),
});

export type CreateSupplierInput = z.infer<typeof createSupplierSchema>;
export type UpdateSupplierInput = z.infer<typeof updateSupplierSchema>;