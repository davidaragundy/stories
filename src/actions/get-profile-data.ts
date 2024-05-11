"use server";

import { EXPIRATION_TIME } from "@/constants";
import { db, posts } from "@/drizzle";
import { and, count, eq, gt } from "drizzle-orm";

export const getProfileDataAction = async (username: string) => {
  const userData = await db.query.users.findFirst({
    where: (fields, { eq }) => eq(fields.username, username),
    columns: {
      id: true,
      firstName: true,
      lastName: true,
      username: true,
      email: true,
      avatarUrl: true,
      createdAt: true,
      followersCount: true,
      followingsCount: true,
    },
    with: {
      followers: true,
      followings: true,
    },
  });

  if (!userData) {
    throw new Error("User not found");
  }

  const userPostsCount = await db
    .select({
      postsCount: count(),
    })
    .from(posts)
    .where(
      and(
        eq(posts.userId, userData.id),
        gt(posts.createdAt, Date.now() - EXPIRATION_TIME),
      ),
    );

  return { ...userData, postsCount: userPostsCount[0].postsCount };
};
