"use server";

import {
  comments,
  commentsReactions,
  db,
  posts,
  postsReactions,
} from "@/drizzle";
import { validateRequest } from "@/lib";
import { ActionResponse, Reaction } from "@/types";
import { and, eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

//TODO: add a rate limiter to this function

export const updateReactionAction = async (
  target: "post" | "comment",
  targetId: string,
  reaction: Reaction,
): Promise<ActionResponse> => {
  const { user, session } = await validateRequest();

  if (!session) {
    return {
      ok: false,
      messages: [
        "You need to be logged in to react to a post 😠",
        "Why do you have access to this function? 🫵",
        "I'm watching you. Closely 👀",
      ],
    };
  }

  //TODO: use a transaction to update the post and postReactions tables
  try {
    const reactionsTargetTable =
      target === "post" ? postsReactions : commentsReactions;
    const reactionsTargetTableIdFieldName = sql.raw(
      target === "post" ? "post_id" : "comment_id",
    );

    const userReaction = await db
      .select()
      .from(reactionsTargetTable)
      .where(
        and(
          eq(reactionsTargetTable.userId, user.id),
          eq(reactionsTargetTableIdFieldName, targetId),
          eq(reactionsTargetTable.type, reaction),
        ),
      );

    const targetTable = target === "post" ? posts : comments;
    const targetTableReactionFieldName = sql.raw(reaction + "_count");
    const increaseOrDecreaseCount = sql.raw(
      userReaction.length === 0 ? "1" : "-1",
    );

    const targetIdPropName = target === "post" ? "postId" : "commentId";

    await Promise.all([
      db.run(
        sql`UPDATE ${targetTable} SET ${targetTableReactionFieldName} = ${targetTableReactionFieldName} + ${increaseOrDecreaseCount} WHERE ${targetTable.id} = ${targetId}`,
      ),
      userReaction.length === 0
        ? db.insert(reactionsTargetTable).values({
            [targetIdPropName]: targetId,
            userId: user.id,
            type: reaction,
          })
        : db
            .delete(reactionsTargetTable)
            .where(
              and(
                eq(reactionsTargetTableIdFieldName, targetId),
                eq(reactionsTargetTable.userId, user.id),
                eq(reactionsTargetTable.type, reaction),
              ),
            ),
    ]);

    revalidatePath("/");

    return {
      ok: true,
      messages: [`Successfully updated ${reaction} reaction count 🤙`],
    };
  } catch (error) {
    console.error(error);

    return {
      ok: false,
      messages: ["Something went wrong while updating reaction count 😭"],
    };
  }
};
