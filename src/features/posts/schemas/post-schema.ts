import { createSelectSchema } from "drizzle-zod";

import { post } from "@/shared/lib/drizzle/schema";

export const postSchema = createSelectSchema(post);
