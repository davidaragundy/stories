"use server";

import { EXPIRATION_TIME } from "@/constants";
import { db } from "@/drizzle";
import { validateRequest } from "@/lib";

export const getProfilePostsAction = async (
  username: string,
  isPublic?: boolean,
) => {
  const { user } = await validateRequest();

  if (!user) {
    throw new Error("User not authenticated");
  }

  if (username !== user.username && !isPublic) {
    throw new Error("User not authorized");
  }

  const existingUser = await db.query.users.findFirst({
    columns: {
      id: true,
    },
    where: (fields, { eq }) => eq(fields.username, username),
  });

  if (!existingUser) {
    throw new Error("User not found");
  }

  const posts = await db.query.posts.findMany({
    where: (fields, { eq, or, and, gt }) =>
      and(
        eq(fields.userId, existingUser.id),
        gt(fields.createdAt, Date.now() - EXPIRATION_TIME),
        isPublic
          ? eq(fields.onlyFollowers, "false")
          : or(
              eq(fields.onlyFollowers, "true"),
              eq(fields.onlyFollowers, "false"),
            ),
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
