"use server";

import { EXPIRATION_TIME } from "@/constants";
import { db } from "@/drizzle";

export const getPostsAction = async () => {
  const posts = await db.query.posts.findMany({
    where: (fields, { gt, and, eq }) =>
      and(
        gt(fields.createdAt, Date.now() - EXPIRATION_TIME),
        eq(fields.onlyFollowers, "false"),
      ),
    orderBy: (fields, { desc }) => [desc(fields.createdAt)],
    with: {
      user: {
        columns: {
          id: true,
          firstName: true,
          lastName: true,
          username: true,
          email: true,
          avatarUrl: true,
          createdAt: true,
        },
      },
      media: true,
      reactions: {
        columns: {
          userId: true,
          type: true,
        },
      },
    },
  });

  return posts;
};
