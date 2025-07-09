import { Hono } from "hono";
import db from "../services/drizzle.js";
import { notes } from "../db/schema.js";
import { eq, and, type InferSelectModel } from "drizzle-orm";
import verifyAuth from "../utils/verifyAuth.js";
import type { Variables } from "../utils/variables.js";

const notesRouter = new Hono<{ Variables: Variables }>();

notesRouter.get("/", verifyAuth, async (c) => {
  const user = c.get("user");

  const data = await db.select().from(notes).where(eq(notes.userId, user.id));

  return c.json({
    success: true,
    result: data,
  });
});

notesRouter.get("/:id", verifyAuth, async (c) => {
  const id = parseInt(c.req.param("id"));
  const user = c.get("user");
  const data = await db
    .select()
    .from(notes)
    .where(and(eq(notes.id, id), eq(notes.userId, user.id)))
    .get();
  return c.json({
    success: true,
    result: data,
  });
});

export default notesRouter;
