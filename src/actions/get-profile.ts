"use server";

import { db } from "@/drizzle";

export const getProfile = async (userId: string) => {
  const profile = await db.query.users.findFirst({
    where: (fields, { eq }) => eq(fields.id, userId),
    with: {
      posts: true,
    },
  });

  return profile;
};
