"use server";

import { db } from "@/drizzle";
import { Reaction } from "@/types";

export const getReactionsAction = async (
  reaction: Reaction,
  targetId: string,
) => {
  const reactions = await db.query.postsReactions.findMany({
    where: (fields, { eq, and }) =>
      and(eq(fields.postId, targetId), eq(fields.type, reaction)),
    with: {
      user: {
        columns: {
          id: true,
          firstName: true,
          lastName: true,
          username: true,
          avatarUrl: true,
        },
      },
    },
  });

  return reactions;
};
