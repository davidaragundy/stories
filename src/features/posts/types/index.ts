import { z } from "zod";

import { postSchema } from "@/features/posts/schemas/post-schema";
import { createPostFormSchema } from "@/features/posts/schemas/create-post-form-schema";

export type Post = z.infer<typeof postSchema>;

export type CreatePostFormValues = z.infer<typeof createPostFormSchema>;
