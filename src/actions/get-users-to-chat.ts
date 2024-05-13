"use server";

import { db, follows, users } from "@/drizzle";
import { and, eq } from "drizzle-orm";
import { alias } from "drizzle-orm/sqlite-core";

export const getUsersToChatAction = async (userId: string) => {
  const followByYou = alias(follows, "followByYou");
  const followByTheOtherPerson = alias(follows, "followByTheOtherPerson");

  const usersWithMutualFollow = await db
    .select({
      id: users.id,
      firstName: users.firstName,
      lastName: users.lastName,
      username: users.username,
      avatarUrl: users.avatarUrl,
    })
    .from(followByYou)
    .where(eq(followByYou.followerId, userId))
    .innerJoin(
      followByTheOtherPerson,
      and(
        eq(followByYou.followerId, followByTheOtherPerson.followingId),
        eq(followByYou.followingId, followByTheOtherPerson.followerId),
      ),
    )
    .innerJoin(users, eq(users.id, followByYou.followingId));

  return usersWithMutualFollow;
};
