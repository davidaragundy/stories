"use server";

import { postsRef, validateRequest } from "@/lib";
import { ActionResponse } from "@/types";
import { db, posts } from "@/drizzle";
import { eq } from "drizzle-orm";
import { deleteObject, ref } from "firebase/storage";

export const deletePostAction = async (
  postId: string,
): Promise<ActionResponse> => {
  const { session } = await validateRequest();

  if (!session) {
    return {
      ok: false,
      messages: [
        "You need to be logged in to delete a post 😠",
        "Why do you have access to this function? 🫵",
        "I'm watching you. Closely 👀",
      ],
    };
  }

  if (!postId) {
    return { ok: false, messages: ["Post ID is required to delete a post 😠"] };
  }

  try {
    //TODO: delete every comment and media associated with the post
    const postMedia = await db.query.postsMedia.findMany({
      columns: {
        id: true,
      },
      where: (pm, { eq }) => eq(pm.postId, postId),
    });

    const mediaRefs = postMedia.map((pm) => ref(postsRef, pm.id));

    await Promise.all(mediaRefs.map((mr) => deleteObject(mr)));

    await db.delete(posts).where(eq(posts.id, postId));

    return { ok: true, messages: ["Post deleted successfully 💩"] };
  } catch (error) {
    console.error(error);

    return { ok: false, messages: ["Failed to delete post 😭"] };
  }
};
