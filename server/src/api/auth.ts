import { Hono, type Context } from "hono";
import db from "../services/drizzle.js";
import { loginSchema, registerSchema } from "../utils/validators/auth.js";
import { users } from "../db/schema.js";
import { eq, type InferSelectModel } from "drizzle-orm";
import bcrypt from "bcryptjs";
import jwt, { type SignOptions } from "jsonwebtoken";
import { deleteCookie, setCookie } from "hono/cookie";
import type { Variables } from "../utils/variables.js";
import verifyAuth from "../utils/verifyAuth.js";
import { z, type ZodSchema } from "zod/v4";
import type { ValidationTargets } from "hono";
import { zValidator as zv } from "@hono/zod-validator";
const authRouter = new Hono<{ Variables: Variables }>();

const zValidator = <
  T extends ZodSchema,
  Target extends keyof ValidationTargets
>(
  target: Target,
  schema: T
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

type User = InferSelectModel<typeof users>;
type SafeUser = Omit<User, "password">;
const UserResponseSchema = z.object({
  success: z.boolean(),
  result: z.object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
  }),
});

const ErrorResponseSchema = z.object({
  message: z.string(),
  errors: z
    .array(
      z.object({
        path: z.string(),
        message: z.string(),
      })
    )
    .optional(),
});

const LogoutResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});

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
  const cookieExpiresDays = parseInt(process.env.JWT_COOKIE_EXPIRES_IN!);
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
      404
    );
  }

  const isPasswordCorrect = await bcrypt.compare(
    password,
    existingUser.password
  );

  console.log("existingUser", existingUser);

  if (!isPasswordCorrect) {
    return c.json(
      {
        message:
          "Invalid Credetials. Please try again with correct credentials",
      },
      401
    );
  }

  const { password: _password, ...safeUser } = existingUser;

  return createAndSendToken(safeUser, c);
});

authRouter.post("/logout", (c) => {
  deleteCookie(c, "jwt");
  return c.json({
    success: true,
    message: "Logged out successfully",
  });
});
export default authRouter;
