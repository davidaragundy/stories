"use server";

import { postCollection } from "@/lib";
import { ActionResponse, Post, Reactions } from "@/types";
import { revalidatePath } from "next/cache";

export const updateReactionCountAction = async (
  post: Post,
  reaction: keyof Reactions,
): Promise<ActionResponse> => {
  try {
    await postCollection.update(post.id, {
      ...{ ...post, id: undefined },
      reactions: {
        ...post.reactions,
        [reaction]: post.reactions[reaction] + 1,
      },
    });

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
