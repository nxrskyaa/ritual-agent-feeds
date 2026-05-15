import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";

const { Pool } = pg;

function getDb() {
  if (!process.env.DATABASE_URL) {
    throw new Error(
      "DATABASE_URL must be set. Did you forget to provision a database?",
    );
  }
  const poolInstance = new Pool({ connectionString: process.env.DATABASE_URL });
  return drizzle(poolInstance, { schema });
}

export const pool = process.env.DATABASE_URL
  ? new Pool({ connectionString: process.env.DATABASE_URL })
  : (null as unknown as InstanceType<typeof Pool>);

export const db = process.env.DATABASE_URL
  ? drizzle(pool, { schema })
  : (null as unknown as ReturnType<typeof getDb>);

export * from "./schema";
