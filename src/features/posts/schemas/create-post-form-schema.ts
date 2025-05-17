import { createInsertSchema } from "drizzle-zod";

import { post } from "@/shared/lib/drizzle/schema";

export const createPostFormSchema = createInsertSchema(post);
