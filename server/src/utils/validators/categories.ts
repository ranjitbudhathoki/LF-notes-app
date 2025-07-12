import { z } from "zod/v4";

export const createCategorSchema = z.object({
  name: z.string().trim().min(3),
});

export const updateCategorySchema = z.object({
  name: z.string().trim().min(3).optional(),
});
