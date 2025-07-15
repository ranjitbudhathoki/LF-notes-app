import { z } from "zod/v4";

export const createNoteSchema = z.object({
  title: z
    .string({ message: "Title is required" })
    .min(1, { message: "Title cannot be empty" })
    .max(100, { message: "Title cannot exceed 100 characters" }),

  content: z
    .string({ message: "Content is required" })
    .min(1, { message: "Content cannot be empty" }),

  categoryIds: z
    .array(z.number({ message: "Invalid category ID" }).positive())
    .min(1, { message: "At least one category must be selected" }),
  isPinned: z.boolean().optional().default(false),
});

export const updateNoteSchema = z.object({
  title: z
    .string()
    .min(1, { message: "Title cannot be empty" })
    .max(100, { message: "Title cannot exceed 100 characters" })
    .optional(),

  content: z.string().min(1, { message: "Content cannot be empty" }).optional(),

  categoryIds: z
    .array(z.number().positive())
    .min(1, { message: "At least one category must be selected" })
    .optional(),
  isPinned: z.boolean().optional(),
});
