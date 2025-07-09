import { Hono, type Context } from "hono";
import verifyAuth from "../utils/verifyAuth.js";
import type { Variables } from "../utils/variables.js";
import db from "../services/drizzle.js";
import { categories } from "../db/schema.js";
import { and, eq } from "drizzle-orm";
import { zValidator } from "@hono/zod-validator";
import { createCategorSchema } from "../utils/validators/categories.js";

const categoriesRouter = new Hono<{ Variables: Variables }>();
categoriesRouter.get("/", verifyAuth, async (c) => {
  const user = c.get("user");

  const data = await db
    .select()
    .from(categories)
    .where(eq(categories.userId, user.id));

  return c.json({
    success: true,
    result: data,
  });
});

categoriesRouter.post(
  "/",
  verifyAuth,
  zValidator("json", createCategorSchema),
  async (c) => {
    const { name, theme, userId } = c.req.valid("json");
    const data = await db.insert(categories).values({ name, theme, userId });

    return c.json({
      success: true,
      result: data,
    });
  },
);

export default categoriesRouter;
