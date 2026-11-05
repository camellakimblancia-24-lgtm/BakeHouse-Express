import { z } from 'zod'
import { roles } from '../../types/roles.js'

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export const createUserSchema = z.object({
  email: z.string().email('Invalid email address format.'),
  password: z.string().min(8, 'Password must be at least 8 characters long.'),
  role: z.enum(roles, {
    message: `Role must be ${roles.join(', ')}.`,
  }),
  first_name: z.string().min(1, 'First name cannot be empty.'),
  last_name: z.string().min(1, 'Last name cannot be empty.'),
});

export const updateUserSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters').optional(),
  role: z.enum(roles).optional(),
  first_name: z.string().min(1, 'First name cannot be empty').optional(),
  last_name: z.string().min(1, 'Last name cannot be empty').optional(),
});

export const userIdParamSchema = z.object({
  id: z.string().uuid('Invalid user UUID'),
  
});

export type LoginInput = z.infer<typeof loginSchema>;
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;