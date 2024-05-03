"use server";

import { db } from "@/drizzle";

export const getFollowingPostsAction = async (userId: string) => {
  const followingUserIds = await db.query.follows.findMany({
    where: (fields, { eq }) => eq(fields.followerId, userId),
    columns: { followingId: true },
  });

  if (!followingUserIds.length) return [];

  const posts = await db.query.posts.findMany({
    where: (fields, { eq, or }) =>
      or(
        ...followingUserIds.map((user) => eq(fields.userId, user.followingId)),
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
