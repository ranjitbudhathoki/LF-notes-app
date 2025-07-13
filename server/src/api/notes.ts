import { Hono } from "hono";
import db from "../services/drizzle.js";
import { noteCategories, notes } from "../db/schema.js";
import {
  eq,
  and,
  count,
  asc,
  desc,
  sql,
  exists,
  or,
  like,
  ilike,
  SQL,
} from "drizzle-orm";
import verifyAuth from "../utils/verifyAuth.js";
import type { Variables } from "../utils/variables.js";
import {
  createNoteSchema,
  updateNoteSchema,
} from "../utils/validators/notes.js";
import { convert } from "url-slug";
import z from "zod";
import { type ZodSchema } from "zod/v4";
import type { ValidationTargets } from "hono";
import { zValidator as zv } from "@hono/zod-validator";

const zValidator = <
  T extends ZodSchema,
  Target extends keyof ValidationTargets,
>(
  target: Target,
  schema: T,
) =>
  zv(target, schema, (result, c) => {
    if (!result.success) {
      return c.json({
        message: "Validation failed",
        errors: result.error.issues.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message,
        })),
      });
    }
  });
const notesRouter = new Hono<{ Variables: Variables }>();

const filterSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).default(10),
  categoryId: z.string().optional(),
  sortBy: z
    .enum(["updatedAt", "createdAt", "titleAsc", "titleDesc"])
    .optional(),
  search: z.string().optional(),
});

notesRouter.get("/", verifyAuth, async (c) => {
  try {
    const user = c.get("user");
    const {
      page,
      limit: requestedLimit,
      categoryId,
      sortBy,
      search,
    } = filterSchema.parse(c.req.query());

    console.log(c.req.query());

    const limit = Math.min(requestedLimit, 20);
    const offset = (page - 1) * limit;

    let orderBy;
    switch (sortBy) {
      case "createdAt":
        orderBy = [desc(notes.createdAt)];
        break;
      case "titleAsc":
        orderBy = [asc(notes.title)];
        break;
      case "titleDesc":
        orderBy = [desc(notes.title)];
        break;
      case "updatedAt":
      default:
        orderBy = [desc(notes.updatedAt)];
        break;
    }

    let whereConditions: any[] = [eq(notes.userId, user.id)];
    if (search) {
      const searchPattern = `%${search}%`;
      whereConditions.push(
        or(
          sql`${notes.title} COLLATE NOCASE LIKE ${searchPattern}` as SQL<unknown>,
          sql`${notes.content} COLLATE NOCASE LIKE ${searchPattern}` as SQL<unknown>,
        ),
      );
    }

    if (categoryId && categoryId !== "all") {
      whereConditions.push(
        exists(
          db
            .select()
            .from(noteCategories)
            .where(
              and(
                eq(noteCategories.noteId, notes.id),
                eq(noteCategories.categoryId, parseInt(categoryId)),
              ),
            ),
        ),
      );
    }

    const where = and(...whereConditions);
    console.log("where conditions:", whereConditions);

    const data = await db.query.notes.findMany({
      where,
      with: {
        noteCategories: {
          with: {
            category: true,
          },
        },
      },
      limit,
      offset,
      orderBy,
    });

    const countResult = await db
      .select({ count: count() })
      .from(notes)
      .where(where)
      .get();

    const total = countResult?.count ?? 0;

    const transformedData = data.map((note) => ({
      id: note.id,
      title: note.title,
      slug: note.slug,
      content: note.content,
      userId: note.userId,
      createdAt: note.createdAt,
      updatedAt: note.updatedAt,
      categories: note.noteCategories.map((nc) => {
        return {
          name: nc.category.name,
          id: nc.category.id,
        };
      }),
    }));

    return c.json({
      success: true,
      result: transformedData,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (e) {
    console.error(e);
    return c.json(
      {
        success: false,
        error: e,
      },
      500,
    );
  }
});

notesRouter.get("/:slug", verifyAuth, async (c) => {
  const slug = c.req.param("slug");
  const user = c.get("user");

  const data = await db.query.notes.findFirst({
    where: and(eq(notes.slug, slug), eq(notes.userId, user.id)),
    with: {
      noteCategories: {
        with: {
          category: true,
        },
      },
    },
  });

  if (!data) {
    return c.json(
      {
        success: false,
        error: "Note not found",
      },
      404,
    );
  }
  const transformedData = {
    id: data.id,
    title: data.title,
    slug: data.slug,
    content: data.content,
    userId: data.userId,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
    categories: data.noteCategories.map((nc) => {
      return {
        name: nc.category.name,
        id: nc.category.id,
      };
    }),
  };
  return c.json({
    success: true,
    result: transformedData,
  });
});

notesRouter.post(
  "/",
  verifyAuth,
  zValidator("json", createNoteSchema),
  async (c) => {
    const { title, content, categoryIds } = c.req.valid("json");
    const user = c.get("user");
    const baseSlug = convert(title);
    const timestamp = new Date()
      .toISOString()
      .replace(/[-:T.]/g, "")
      .slice(0, 14);
    const slug = `${baseSlug}-${timestamp}`;

    if (categoryIds.length === 0) {
      return c.json({
        success: false,
        message:
          "Category cannot be empty. Please select at least one category.",
      });
    }
    const result = await db.transaction(async (tx) => {
      const note = await tx
        .insert(notes)
        .values({
          title,
          content,
          slug,
          userId: user.id,
        })
        .returning()
        .get();

      const noteCategoryValues = categoryIds.map((categoryId) => ({
        noteId: note.id,
        categoryId: categoryId,
      }));

      await tx.insert(noteCategories).values(noteCategoryValues);
      return note;
    });

    return c.json({
      success: true,
      result,
    });
  },
);

notesRouter.patch(
  "/:slug",
  verifyAuth,
  zValidator("json", updateNoteSchema),
  async (c) => {
    const slug = c.req.param("slug");
    const { categoryIds, ...rest } = c.req.valid("json");

    const user = c.get("user");

    const existingNote = await db
      .select({ id: notes.id })
      .from(notes)
      .where(and(eq(notes.slug, slug), eq(notes.userId, user.id)))
      .get();

    if (!existingNote) {
      return c.json({
        success: false,
        message: "Note not found or you don't have permission to edit it",
      });
    }

    const result = await db.transaction(async (tx) => {
      const updatedNote = await tx
        .update(notes)
        .set({
          ...rest,
        })
        .where(eq(notes.id, existingNote.id))
        .returning()
        .get();

      if (categoryIds) {
        await tx
          .delete(noteCategories)
          .where(eq(noteCategories.noteId, existingNote.id));

        const noteCategoryValues = categoryIds.map((categoryId) => ({
          noteId: existingNote.id,
          categoryId: categoryId,
        }));

        await tx.insert(noteCategories).values(noteCategoryValues);
      }

      return updatedNote;
    });

    return c.json({
      success: true,
      data: result,
    });
  },
);

notesRouter.delete("/:slug", verifyAuth, async (c) => {
  const slug = c.req.param("slug");
  const user = c.get("user");

  const note = await db
    .select()
    .from(notes)
    .where(and(eq(notes.slug, slug), eq(notes.userId, user.id)))
    .get();

  if (!note) {
    return c.json({
      success: false,
      message: "Note not found",
    });
  }

  await db.delete(notes).where(eq(notes.slug, slug));

  return c.json({
    success: true,
    message: "Note deleted successfully",
  });
});

export default notesRouter;
