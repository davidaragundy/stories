"use server";

import { db, commentsReactions } from "@/drizzle";
import { validateRequest } from "@/lib";
import { ActionResponse, Reaction } from "@/types";
import { LibsqlError } from "@libsql/client";
import { and, eq, sql } from "drizzle-orm";

interface Props {
  reaction: Reaction;
  commentId: string;
}

//TODO!: add a rate limiter to this function

export const updateCommentReactionAction = async ({
  reaction,
  commentId,
}: Props): Promise<ActionResponse> => {
  const { user, session } = await validateRequest();

  if (!session) {
    return {
      ok: false,
      messages: [
        `You need to be logged in to react to a comments 😠`,
        "Why do you have access to this function? 🫵",
        "I'm watching you. Closely 👀",
      ],
    };
  }

  //TODO: use a transaction to update the comment and commentReactions tables
  try {
    const userReaction = await db
      .select()
      .from(commentsReactions)
      .where(
        and(
          eq(commentsReactions.userId, user.id),
          eq(commentsReactions.commentId, commentId),
          eq(commentsReactions.type, reaction),
        ),
      );

    const commentReactionFieldName = sql.raw(reaction + "_count");
    const increaseOrDecreaseCount = sql.raw(
      userReaction.length === 0 ? "1" : "-1",
    );

    await Promise.all([
      db.run(
        sql`UPDATE comments SET ${commentReactionFieldName} = ${commentReactionFieldName} + ${increaseOrDecreaseCount} WHERE comments.id = ${commentId}`,
      ),
      userReaction.length === 0
        ? db.insert(commentsReactions).values({
            commentId: commentId,
            userId: user.id,
            type: reaction,
          })
        : db
            .delete(commentsReactions)
            .where(
              and(
                eq(commentsReactions.commentId, commentId),
                eq(commentsReactions.userId, user.id),
                eq(commentsReactions.type, reaction),
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
        messages: [`The comment no longer exist 😢`],
      };
    }

    console.error(error);

    return {
      ok: false,
      messages: ["Something went wrong while updating reaction count 😭"],
    };
  }
};
