import { Hono, type Context } from "hono";
import db from "../services/drizzle.js";
import { zValidator } from "@hono/zod-validator";
import { loginSchema, registerSchema } from "../utils/validators/auth.js";
import { users } from "../db/schema.js";
import { eq, type InferSelectModel } from "drizzle-orm";
import bcrypt from "bcryptjs";
import jwt, { type SignOptions } from "jsonwebtoken";
import { setCookie } from "hono/cookie";
import type { Variables } from "../utils/variables.js";
import verifyAuth from "../utils/verifyAuth.js";

const authRouter = new Hono<{ Variables: Variables }>();
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
    sameSite: "Lax",
    httpOnly: true,
    path: "/",
    expires: new Date(Date.now() + cookieExpiresDays * 24 * 60 * 60 * 1000),
  });

  c.status(201);
  return c.json({
    success: true,
    token,
    result: user,
  });
}

authRouter.get("/me", verifyAuth, async (c) => {
  const user = c.get("user");

  if (!user) {
    return c.json({ message: "You're not logged in. Please try again." }, 403);
  }

  return c.json({
    success: true,
    result: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  });
});

authRouter.post("/signup", zValidator("json", registerSchema), async (c) => {
  const { name, password, email } = c.req.valid("json");
  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .get({});

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
  const { email, password } = c.req.valid("json");

  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .get();

  if (!existingUser) {
    return c.json(
      {
        message:
          "Invalid Credetials. Please try again with correct credentials",
      },
      404,
    );
  }

  const isPasswordCorrect = await bcrypt.compare(
    password,
    existingUser.password,
  );

  console.log("existingUser", existingUser);

  if (!isPasswordCorrect) {
    return c.json(
      {
        message:
          "Invalid Credetials. Please try again with correct credentials",
      },
      401,
    );
  }

  const { password: _password, ...safeUser } = existingUser;

  return createAndSendToken(safeUser, c);
});

export default authRouter;
