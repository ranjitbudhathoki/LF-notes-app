import { z } from "zod/v4";

export const createCategorSchema = z.object({
  name: z
    .string({ message: "Category name is required" })
    .trim()
    .min(3, { message: "Category name must be at least 3 characters long" }),
});

export const updateCategorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, { message: "Category name must be at least 3 characters long" })
    .optional(),
});
