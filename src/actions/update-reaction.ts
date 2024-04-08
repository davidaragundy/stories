"use server";

import {
  comments,
  commentsReactions,
  db,
  posts,
  postsReactions,
} from "@/drizzle";
import { validateRequest } from "@/lib";
import { ActionResponse } from "@/types";
import { and, eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const updateReactionAction = async (
  target: "post" | "comment",
  targetId: string,
  reaction: "fire" | "poop" | "cap",
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

    const userReaction = await db.run(
      sql`SELECT * FROM ${reactionsTargetTable} WHERE ${reactionsTargetTable.userId} = ${user.id} AND ${reactionsTargetTableIdFieldName} = ${targetId}`,
    );

    const targetTable = target === "post" ? posts : comments;
    const targetTableReactionFieldName = sql.raw(reaction + "_count");
    const targetIdPropName = target === "post" ? "postId" : "commentId";

    if (userReaction.rows.length === 0) {
      await Promise.all([
        db.run(
          sql`UPDATE ${targetTable} SET ${targetTableReactionFieldName} = ${targetTableReactionFieldName} + 1 WHERE ${targetTable.id} = ${targetId}`,
        ),
        db.insert(reactionsTargetTable).values({
          [targetIdPropName]: targetId,
          userId: user.id,
          type: reaction,
        }),
      ]);

      revalidatePath("/");

      return {
        ok: true,
        messages: [`Successfully updated ${reaction} reaction count 🤙`],
      };
    }

    if (userReaction.rows.length === 1) {
      if (userReaction.rows[0].type === reaction) {
        await Promise.all([
          db.run(
            sql`UPDATE ${targetTable} SET ${targetTableReactionFieldName} = ${targetTableReactionFieldName} - 1 WHERE ${targetTable.id} = ${targetId}`,
          ),
          db
            .delete(reactionsTargetTable)
            .where(
              and(
                eq(reactionsTargetTableIdFieldName, targetId),
                eq(reactionsTargetTable.userId, user.id),
              ),
            ),
        ]);

        revalidatePath("/");

        return {
          ok: true,
          messages: [`Successfully updated ${reaction} reaction count 🤙`],
        };
      }

      const reactionFieldToDecrease = sql.raw(
        userReaction.rows[0].type + "_count",
      );

      await Promise.all([
        db.run(
          sql`UPDATE ${targetTable} SET ${reactionFieldToDecrease} = ${reactionFieldToDecrease} - 1 WHERE ${targetTable.id} = ${targetId}`,
        ),
        db.run(
          sql`UPDATE ${targetTable} SET ${targetTableReactionFieldName} = ${targetTableReactionFieldName} + 1 WHERE ${targetTable.id} = ${targetId}`,
        ),
        db
          .update(reactionsTargetTable)
          .set({ type: reaction })
          .where(
            and(
              eq(reactionsTargetTableIdFieldName, targetId),
              eq(reactionsTargetTable.userId, user.id),
            ),
          ),
      ]);

      revalidatePath("/");

      return {
        ok: true,
        messages: [`Successfully updated ${reaction} reaction count 🤙`],
      };
    }

    throw new Error(
      "Something went wrong while updating reaction count, the user have multiple reactions in the same post or comment",
    );
  } catch (error) {
    console.error(error);

    return {
      ok: false,
      messages: ["Something went wrong while updating reaction count 😭"],
    };
  }
};
