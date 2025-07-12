import { z } from "zod/v4";

export const createNoteSchema = z.object({
  title: z.string().min(1).max(100),
  content: z.string().min(1),
  categoryIds: z.array(z.number().positive()).min(1),
});

export const updateNoteSchema = z.object({
  title: z.string().min(1).max(100).optional(),
  content: z.string().min(1).optional(),
  categoryIds: z.array(z.number().positive()).min(1).optional(),
});
