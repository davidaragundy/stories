"use server";

import { db, postsReactions } from "@/drizzle";
import { validateRequest } from "@/lib";
import { ActionResponse, Reaction } from "@/types";
import { LibsqlError } from "@libsql/client";
import { and, eq, sql } from "drizzle-orm";

interface Props {
  reaction: Reaction;
  postId: string;
}

//TODO!: add a rate limiter to this function

export const updatePostReactionAction = async ({
  reaction,
  postId,
}: Props): Promise<ActionResponse> => {
  const { user, session } = await validateRequest();

  if (!session) {
    return {
      ok: false,
      messages: [
        `You need to be logged in to react to a post 😠`,
        "Why do you have access to this function? 🫵",
        "I'm watching you. Closely 👀",
      ],
    };
  }

  //TODO: use a transaction to update the post and postReactions tables
  try {
    const userReaction = await db
      .select()
      .from(postsReactions)
      .where(
        and(
          eq(postsReactions.userId, user.id),
          eq(postsReactions.postId, postId),
          eq(postsReactions.type, reaction),
        ),
      );

    const postReactionFieldName = sql.raw(reaction + "_count");
    const increaseOrDecreaseCount = sql.raw(
      userReaction.length === 0 ? "1" : "-1",
    );

    await Promise.all([
      db.run(
        sql`UPDATE posts SET ${postReactionFieldName} = ${postReactionFieldName} + ${increaseOrDecreaseCount} WHERE posts.id = ${postId}`,
      ),
      userReaction.length === 0
        ? db.insert(postsReactions).values({
            postId: postId,
            userId: user.id,
            type: reaction,
          })
        : db
            .delete(postsReactions)
            .where(
              and(
                eq(postsReactions.postId, postId),
                eq(postsReactions.userId, user.id),
                eq(postsReactions.type, reaction),
              ),
            ),
    ]);

    return {
      ok: true,
      messages: [`Successfully updated ${reaction} reaction count 🤙`],
    };
  } catch (error) {
    if (error instanceof LibsqlError && error.message.includes("FOREIGN KEY")) {
      return {
        ok: false,
        messages: [`The post no longer exist 😢`],
      };
    }

    console.error(error);

    return {
      ok: false,
      messages: ["Something went wrong while updating reaction count 😭"],
    };
  }
};
