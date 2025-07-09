import { Hono, type Context } from "hono";
import db from "../services/drizzle.js";
import { zValidator } from "@hono/zod-validator";
import { loginSchema, registerSchema } from "../utils/validators/auth.js";
import { users } from "../db/schema.js";
import { eq, type InferSelectModel } from "drizzle-orm";
import bcrypt from "bcryptjs";
import jwt, { type SignOptions } from "jsonwebtoken";
import { setCookie } from "hono/cookie";

const authRouter = new Hono();
type User = InferSelectModel<typeof users>;
type SafeUser = Omit<User, "password">;

function signToken(id: number): string {
  const secret = process.env.JWT_SECRET;
  let expiresIn = process.env.JWT_EXPIRES_IN;

  if (!secret || !expiresIn) {
    throw new Error("JWT_SECRET or JWT_EXPIRES_IN is not defined");
  }

  const options: SignOptions = {
    expiresIn: expiresIn as any,
  };

  return jwt.sign({ id }, secret, options);
}

function createAndSendToken(user: SafeUser, c: Context) {
  const cookieExpiresDays = parseInt(
    process.env.JWT_COOKIE_EXPIRES_IN || "7",
    10,
  );
  const token = signToken(user.id);
  setCookie(c, "jwt", token, {
    expires: new Date(Date.now() + cookieExpiresDays * 24 * 60 * 60 * 1000),
  });

  c.status(201);
  return c.json({
    success: true,
    token,
    result: user,
  });
}

authRouter.post("/signup", zValidator("json", registerSchema), async (c) => {
  const { name, password, email } = c.req.valid("json");
  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .get();

  if (existingUser) {
    return c.json({ message: "User already exists" }, 400);
  }

  const hashedpassword = await bcrypt.hash(password, 12);

  const newUser = await db
    .insert(users)
    .values({
      email,
      password: hashedpassword,
      name,
    })
    .returning({
      id: users.id,
      name: users.name,
      email: users.email,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
    })
    .get();

  return createAndSendToken(newUser, c);
});

authRouter.post("/login", zValidator("json", loginSchema), async (c) => {
  // implement login logic
});

export default authRouter;
