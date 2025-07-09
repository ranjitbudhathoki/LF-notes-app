import { z } from "zod/v4";

export const createCategorSchema = z.object({
  name: z.string().trim().min(3),
  theme: z.string().trim(),
  userId: z.number(),
});
