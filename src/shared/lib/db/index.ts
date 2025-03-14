import { loadEnvConfig } from "@next/env";
import { drizzle } from "drizzle-orm/neon-http";

loadEnvConfig(process.cwd());

export const db = drizzle(process.env.DATABASE_URL!);
