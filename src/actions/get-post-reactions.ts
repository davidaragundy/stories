"use server";

import { db } from "@/drizzle";
import { Reaction } from "@/types";

interface Props {
  reaction: Reaction;
  postId: string;
}

export const getPostReactionsAction = async ({ reaction, postId }: Props) => {
  const reactions = await db.query.postsReactions.findMany({
    where: (fields, { eq, and }) =>
      and(eq(fields.postId, postId), eq(fields.type, reaction)),
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
