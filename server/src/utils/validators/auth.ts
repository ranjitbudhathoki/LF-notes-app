import { z } from "zod/v4";
export const registerSchema = z.object({
  name: z.string().trim().min(2),
  email: z.email().trim(),
  password: z.string().trim().min(8),
});

export const loginSchema = z.object({
  email: z.email().trim(),
  password: z.string().trim(),
});
