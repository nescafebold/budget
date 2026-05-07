import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "@/lib/db/schema";

if (!process.env.DATABASE_URL) {
    throw new Error(
        "DATABASE_URL is not set. Please add it to your .env.local file. " +
        "Get it from your Neon dashboard at https://neon.tech"
    );
}

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql, { schema });
export { schema };
