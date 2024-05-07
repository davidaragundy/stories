"use server";

import { commentsRef, postsRef, validateRequest } from "@/lib";
import { ActionResponse } from "@/types";
import { db, posts } from "@/drizzle";
import { eq, sql } from "drizzle-orm";
import { deleteObject, ref } from "firebase/storage";

export const deletePostAction = async (
  postId: string,
): Promise<ActionResponse> => {
  const { user } = await validateRequest();

  if (!user) {
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
    const [postMedia, postCommentsMedia] = await Promise.all([
      db.query.postsMedia.findMany({
        columns: {
          id: true,
        },
        where: (pm, { eq }) => eq(pm.postId, postId),
      }),
      db.query.commentsMedia.findMany({
        columns: {
          id: true,
        },
        where: (pm, { eq }) => eq(pm.postId, postId),
      }),
    ]);

    const mediaRefs = postMedia
      .map((pm) => ref(postsRef, pm.id))
      .concat(postCommentsMedia.map((pcm) => ref(commentsRef, pcm.id)));

    await Promise.all(mediaRefs.map((mr) => deleteObject(mr)));

    await Promise.all([
      db.delete(posts).where(eq(posts.id, postId)),
      db.run(
        sql`UPDATE users SET posts_count = posts_count - 1 WHERE users.id = ${user.id}`,
      ),
    ]);

    return { ok: true, messages: ["Post deleted successfully 💩"] };
  } catch (error) {
    console.error(error);

    return { ok: false, messages: ["Failed to delete post 😭"] };
  }
};
