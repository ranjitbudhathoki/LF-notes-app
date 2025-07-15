import { serve } from "@hono/node-server";
import { Hono } from "hono";
import authRouter from "./api/auth.js";
import notesRouter from "./api/notes.js";
import categoriesRouter from "./api/categories.js";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { OpenAPIHono } from "@hono/zod-openapi";
import { swaggerUI } from "@hono/swagger-ui";
const app = new OpenAPIHono();

app.use(logger());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.onError((err, c) => {
  if (err.name === "TokenExpiredError") {
    return c.json(
      {
        name: err.name,
        message: "Token has expired. Please login again",
      },
      401
    );
  }

  console.log("err.name", err);
  if (err.name === "JsonWebTokenError") {
    return c.json(
      {
        message: "Invalid token. Please login again",
      },
      401
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
    500
  );
});

app.route("/api/auth", authRouter);
app.route("/api/notes", notesRouter);
app.route("/api/categories", categoriesRouter);

app.doc("/doc", {
  openapi: "3.0.0",
  info: {
    version: "1.0.0",
    title: "Leapfrog Notes API",
    description:
      "Api documenation for managing notes and categories with authentication",
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Development server",
    },
  ],
});

app.get("/swagger", swaggerUI({ url: "/doc" }));
serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);
