import { Hono, type Context } from "hono";
import db from "../services/drizzle.js";
import { notes, users } from "../db/schema.js";
import { eq, and, type InferSelectModel } from "drizzle-orm";
import verifyAuth from "../utils/verifyAuth.js";
import type { AppContext } from "../utils/appContext.js";

const notesRouter = new Hono();

notesRouter.get("/", verifyAuth, async (c: Context<AppContext>) => {
  const user = c.get("user");

  const data = await db.select().from(notes).where(eq(notes.userId, user.id));

  return c.json({
    success: true,
    result: data,
  });
});

notesRouter.get("/:id", verifyAuth, async (c: Context<AppContext>) => {
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
