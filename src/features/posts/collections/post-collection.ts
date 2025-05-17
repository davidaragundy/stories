import { createElectricCollection } from "@tanstack/db-collections";

import { BASE_URL } from "@/shared/constants";

import { postSchema } from "@/features/posts/schemas/post-schema";
import type { Post } from "@/features/posts/types";

export const postCollection = createElectricCollection<Post>({
  id: "posts",
  streamOptions: {
    url: `${BASE_URL}/api/shape`,
    params: {
      table: "post",
    },
  },
  primaryKey: ["id"],
  schema: postSchema,
});
