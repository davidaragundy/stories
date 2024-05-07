"use server";

import { db } from "@/drizzle";

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
      postsCount: true,
    },
    with: {
      followers: true,
      followings: true,
    },
  });

  if (!userData) {
    throw new Error("User not found");
  }

  return userData;
};
