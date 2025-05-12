import { loadEnvConfig } from "@next/env";
import { drizzle } from "drizzle-orm/neon-http";

import * as schema from "./schema";

loadEnvConfig(process.cwd());

export const db = drizzle(process.env.DATABASE_URL!, { schema });
