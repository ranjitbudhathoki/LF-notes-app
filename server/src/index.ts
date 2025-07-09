import { serve } from "@hono/node-server";
import { Hono } from "hono";
import authRouter from "./api/auth.js";
import verifyAuth from "./utils/verifyAuth.js";
import notesRouter from "./api/notes.js";
import categoriesRouter from "./api/categories.js";
const app = new Hono();

app.get("/", verifyAuth, async (c) => {
  return c.text("Hello Hono!");
});

app.route("/api/auth", authRouter);
app.route("/api/notes", notesRouter);
app.route("/api/categories", categoriesRouter);

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  },
);
