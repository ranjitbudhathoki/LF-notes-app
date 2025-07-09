import { z } from "zod/v4";

export const createNoteSchema = z.object({
  title: z.string().min(1).max(100),
  content: z.string().min(1),
  categoryIds: z.array(z.number().positive()),
});
