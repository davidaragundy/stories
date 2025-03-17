import { loadEnvConfig } from "@next/env";
import { drizzle } from "drizzle-orm/neon-http";
import { Redis } from "@upstash/redis";

import * as schema from "./schema";

loadEnvConfig(process.cwd());

export const db = drizzle(process.env.DATABASE_URL!, { schema });

export const redis = Redis.fromEnv({
  automaticDeserialization: false,
});
