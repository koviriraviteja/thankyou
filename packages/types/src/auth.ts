import { z } from 'zod';

export const UserSchema = z.object({
  id: z.string(),
  phoneNumber: z.string(),
  email: z.string().email().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  role: z.enum(['user', 'dealer', 'admin']),
});

export type User = z.infer<typeof UserSchema>;
