"use server";

import { db, follows, users } from "@/drizzle";
import { validateRequest } from "@/lib";
import { ActionResponse } from "@/types";
import { and, eq } from "drizzle-orm";

export const followAction = async (userId: string): Promise<ActionResponse> => {
  const { user } = await validateRequest();

  if (!user) {
    return {
      ok: false,
      messages: [
        "You need to be logged in to follow a person 😠",
        "Why do you have access to this function? 🫵",
        "I'm watching you. Closely 👀",
      ],
    };
  }

  const follow = await db.query.follows.findFirst({
    where: (fields, { eq, and }) =>
      and(eq(fields.followerId, user.id), eq(fields.followingId, userId)),
  });

  const isAlreadyFollowing = !!follow;

  const [followerData, followingData] = await Promise.all([
    db.query.users.findFirst({
      where: (fields, { eq }) => eq(fields.id, user.id),
      columns: { id: true, followingsCount: true },
    }),
    db.query.users.findFirst({
      where: (fields, { eq }) => eq(fields.id, userId),
      columns: { id: true, followersCount: true },
    }),
  ]);

  if (!followingData) {
    return {
      ok: false,
      messages: ["User not found 😠"],
    };
  }

  if (isAlreadyFollowing) {
    try {
      await Promise.all([
        db
          .delete(follows)
          .where(
            and(
              eq(follows.followerId, followerData!.id),
              eq(follows.followingId, followingData!.id),
            ),
          ),
        db
          .update(users)
          .set({
            followingsCount: followerData!.followingsCount - 1,
          })
          .where(eq(users.id, followerData!.id)),
        db
          .update(users)
          .set({
            followersCount: followingData!.followersCount - 1,
          })
          .where(eq(users.id, followingData!.id)),
      ]);

      return { ok: true, messages: ["UnFollowed successfully"] };
    } catch (error) {
      console.error(error);

      return {
        ok: false,
        messages: ["An error occurred while trying to unfollow 😢"],
      };
    }
  } else {
    try {
      await Promise.all([
        db.insert(follows).values({
          followerId: followerData!.id,
          followingId: followingData!.id,
          createdAt: Date.now(),
        }),
        db
          .update(users)
          .set({
            followingsCount: followerData!.followingsCount + 1,
          })
          .where(eq(users.id, followerData!.id)),
        db
          .update(users)
          .set({
            followersCount: followingData!.followersCount + 1,
          })
          .where(eq(users.id, followingData!.id)),
      ]);

      return { ok: true, messages: ["Followed successfully"] };
    } catch (error) {
      console.error(error);

      return {
        ok: false,
        messages: ["An error occurred while trying to unfollow 😢"],
      };
    }
  }
};
