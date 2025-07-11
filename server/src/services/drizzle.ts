import { drizzle } from "drizzle-orm/libsql";
import * as schema from "../db/schema.js";
const db = drizzle(process.env.DATABASE_URL!, { schema });
export default db;
