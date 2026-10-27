import { z } from 'zod';

export const createWorkerSchema = z.object({
  email: z.string().email('Invalid email address format.'),
  password: z.string().min(6, 'Password must be at least 6 characters long.'),
  role: z.enum(['admin', 'manager', 'cashier', 'baker'], {
    message: 'Role must be admin, manager, cashier, or baker.',
  }),
});

export type CreateWorkerInput = z.infer<typeof createWorkerSchema>;