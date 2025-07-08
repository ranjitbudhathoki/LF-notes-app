import { Hono } from "hono";
const authRouter = new Hono();
import { zValidator } from "@hono/zod-validator";
import { loginSchema, registerSchema } from "../utils/validators/auth.js";
authRouter.post("/register", zValidator("json", registerSchema), async (c) => {
  // implement registration logic
});

authRouter.post("/login", zValidator("json", loginSchema), async (c) => {
  // implement login logic
});

export default authRouter;
