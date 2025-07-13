import { Hono } from "hono";
import verifyAuth from "../utils/verifyAuth.js";
import type { Variables } from "../utils/variables.js";
import db from "../services/drizzle.js";
import { categories } from "../db/schema.js";
import { and, eq, getTableColumns } from "drizzle-orm";
import {
  createCategorSchema,
  updateCategorySchema,
} from "../utils/validators/categories.js";

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

const categoriesRouter = new Hono<{ Variables: Variables }>();

categoriesRouter.get("/", verifyAuth, async (c) => {
  const user = c.get("user");
  const { userId, ...rest } = getTableColumns(categories);

  const data = await db
    .select({ ...rest })
    .from(categories)
    .where(eq(categories.userId, user.id));

  return c.json({
    success: true,
    result: data,
  });
});

categoriesRouter.get("/:id", verifyAuth, async (c) => {
  const id = parseInt(c.req.param("id"));
  const user = c.get("user");

  const category = await db
    .select()
    .from(categories)
    .where(and(eq(categories.id, id), eq(categories.userId, user.id)))
    .get();

  if (!category) {
    return c.json(
      {
        success: false,
        message: "Category not found",
      },
      404,
    );
  }

  return c.json({
    success: true,
    result: category,
  });
});

categoriesRouter.post(
  "/",
  verifyAuth,
  zValidator("json", createCategorSchema),
  async (c) => {
    const { name } = c.req.valid("json");
    const user = c.get("user");

    const data = await db
      .insert(categories)
      .values({ name, userId: user.id })
      .returning({
        id: categories.id,
        name: categories.name,

        createdAt: categories.createdAt,
        updatedAt: categories.updatedAt,
      })
      .get();

    return c.json({
      success: true,
      result: data,
    });
  },
);

categoriesRouter.patch(
  "/:id",
  verifyAuth,
  zValidator("json", updateCategorySchema),
  async (c) => {
    const id = parseInt(c.req.param("id"));
    const user = c.get("user");
    const parsedBody = c.req.valid("json");

    const category = await db
      .select({ id: categories.id })
      .from(categories)
      .where(and(eq(categories.id, id), eq(categories.userId, user.id)))
      .get();

    if (!category) {
      return c.json(
        {
          success: false,
          message: "Category not found.",
        },
        404,
      );
    }

    await db.update(categories).set(parsedBody).where(eq(categories.id, id));

    const updatedCategory = await db
      .select({
        id: categories.id,
        name: categories.name,
        createdAt: categories.createdAt,
        updatedAt: categories.updatedAt,
      })
      .from(categories)
      .where(eq(categories.id, id))
      .get();

    return c.json({
      success: true,
      result: updatedCategory,
    });
  },
);

categoriesRouter.delete("/:id", verifyAuth, async (c) => {
  const id = parseInt(c.req.param("id"));
  const user = c.get("user");

  const category = await db
    .select({ id: categories.id })
    .from(categories)
    .where(and(eq(categories.id, id), eq(categories.userId, user.id)))
    .get();

  if (!category) {
    return c.json(
      {
        success: false,
        message: "Category not found.",
      },
      404,
    );
  }

  await db.delete(categories).where(eq(categories.id, id));

  return c.json({
    success: true,
    message: "Category deleted successfully.",
  });
});

export default categoriesRouter;
