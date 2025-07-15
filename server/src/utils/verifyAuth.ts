import { type Context, type Next } from "hono";
import { getCookie } from "hono/cookie";
import jwt, { type JwtPayload } from "jsonwebtoken";
import db from "../services/drizzle.js";
import { users } from "../db/schema.js";
import { eq } from "drizzle-orm";

export default async function verifyAuth(c: Context, next: Next) {
  const { authorization } = c.req.header();
  const jwtCookie = getCookie(c, "jwt");
  let token;
  if (authorization && authorization.startsWith("Bearer")) {
    token = authorization.split(" ")[1];
  } else if (jwtCookie) {
    token = jwtCookie;
  }

  if (!token) {
    return c.json(
      {
        message: "Unauthorized. You aren't logged. Please login to get access",
      },
      401,
    );
  }

  try {
    const decodedToken = jwt.verify(
      token,
      process.env.JWT_SECRET!,
    ) as JwtPayload;

    const currentUser = await db
      .select()
      .from(users)
      .where(eq(users.id, decodedToken.id))
      .get();

    if (!currentUser) {
      return c.json(
        {
          message: "The user belonging to this token no longer exists",
        },
        401,
      );
    }

    c.set("user", currentUser);
    await next();
  } catch (error) {
    console.error("Authentication error:", error);
    return c.json(
      {
        message: "Unauthorized. Invalid or expired token.",
      },
      401,
    );
  }
}
