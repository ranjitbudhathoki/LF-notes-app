import { drizzle } from "drizzle-orm/libsql";
const db = drizzle(process.env.DATABASE_URL!);
