import { z } from "zod/v4";

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: "Name must be at least 2 characters long" }),
  email: z.email({ message: "Invalid email " }).trim(),
  password: z
    .string()
    .trim()
    .min(8, { message: "Password must be at least 8 characters long" }),
});

export const loginSchema = z.object({
  email: z.email().trim(),
  password: z.string().trim(),
});
