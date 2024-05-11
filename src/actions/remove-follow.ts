"use server";

import { db, follows } from "@/drizzle";
import { validateRequest } from "@/lib";
import { ActionResponse } from "@/types";
import { and, eq, sql } from "drizzle-orm";

export const removeFollowAction = async (
  userId: string,
): Promise<ActionResponse> => {
  const { user } = await validateRequest();

  if (!user) {
    return {
      ok: false,
      messages: [
        "You need to be logged in to remove a person from your followers 😠",
        "Why do you have access to this function? 🫵",
        "I'm watching you. Closely 👀",
      ],
    };
  }

  //TODO: use a transaction
  try {
    await Promise.all([
      db
        .delete(follows)
        .where(
          and(eq(follows.followerId, userId), eq(follows.followingId, user.id)),
        ),
      db.run(
        sql`UPDATE users SET followings_count = followings_count - 1 WHERE id = ${userId}`,
      ),
      db.run(
        sql`UPDATE users SET followers_count = followers_count - 1 WHERE id = ${user.id}`,
      ),
    ]);

    return { ok: true, messages: ["Removed form followers successfully"] };
  } catch (error) {
    console.error(error);

    return {
      ok: false,
      messages: ["An error occurred while trying to remove from followers 😢"],
    };
  }
};
