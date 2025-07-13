import { z } from "zod/v4";

export const registerSchema = z.object({
  name: z
    .string({ message: "Name is required" })
    .trim()
    .min(2, { message: "Name must be at least 2 characters long" }),

  email: z.email({ message: "Invalid email address" }).trim(),

  password: z
    .string({ message: "Password is required" })
    .trim()
    .min(8, { message: "Password must be at least 8 characters long" }),
});

export const loginSchema = z.object({
  email: z.email({ message: "Invalid email address" }).trim(),

  password: z.string({ message: "Password is required" }).trim(),
});
