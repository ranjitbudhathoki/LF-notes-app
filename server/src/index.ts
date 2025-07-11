import { serve } from "@hono/node-server";
import { Hono } from "hono";
import authRouter from "./api/auth.js";
import verifyAuth from "./utils/verifyAuth.js";
import notesRouter from "./api/notes.js";
import categoriesRouter from "./api/categories.js";
import { HTTPException } from "hono/http-exception";
import { cors } from "hono/cors";
const app = new Hono();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.onError((err, c) => {
  if (err.name === "TokenExpiredError") {
    return c.json(
      {
        message: "Token has expired. Please login again",
      },
      401,
    );
  }

  if (err.name === "JsonWebTokenError") {
    return c.json(
      {
        message: "Invalid token. Please login again",
      },
      401,
    );
  }

  return c.json(
    {
      message: "Internal server error",
      error:
        process.env.NODE_ENV === "development"
          ? err.message
          : "Something went wrong",
    },
    500,
  );
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
