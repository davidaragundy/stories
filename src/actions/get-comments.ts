"use server";

import { db } from "@/drizzle";

export const getCommentsAction = async (postId: string) => {
  const comments = await db.query.comments.findMany({
    where: (fields, { eq }) => eq(fields.postId, postId),
    orderBy: (fields, { asc }) => [asc(fields.createdAt)],
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

  return comments;
};
