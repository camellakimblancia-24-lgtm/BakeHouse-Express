import { z } from 'zod';

export const createWorkerSchema = z.object({
  email: z.string().email('Invalid email address format.'),
  password: z.string().min(6, 'Password must be at least 6 characters long.'),
  role: z.enum(['admin', 'cashier', 'baker'], {
    message: 'Role must be admin, manager, cashier, or baker.',
  }),
});

export const deleteWorkerSchema = z.object({
    userId: z.string().uuid('Invalid user ID format.'),
});

export type CreateWorkerInput = z.infer<typeof createWorkerSchema>;
export type DeleteWorkerInput = z.infer<typeof deleteWorkerSchema>;