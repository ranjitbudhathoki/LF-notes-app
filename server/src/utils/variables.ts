import type { InferSelectModel } from "drizzle-orm";
import type { users } from "../db/schema.js";

type User = InferSelectModel<typeof users>;
export interface Variables {
  user: User;
}
