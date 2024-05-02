"use server";

import { commentsRef, validateRequest } from "@/lib";
import { ActionResponse, Post } from "@/types";
import { db, comments, posts } from "@/drizzle";
import { eq } from "drizzle-orm";
import { deleteObject, ref } from "firebase/storage";

export const deleteCommentAction = async (
  commentId: string,
  postId: string,
): Promise<ActionResponse> => {
  const { session } = await validateRequest();

  if (!session) {
    return {
      ok: false,
      messages: [
        "You need to be logged in to delete a comment 😠",
        "Why do you have access to this function? 🫵",
        "I'm watching you. Closely 👀",
      ],
    };
  }

  if (!commentId) {
    return {
      ok: false,
      messages: ["Comment ID is required to delete a comment 😠"],
    };
  }

  let post: Post | undefined;

  try {
    post = await db.query.posts.findFirst({
      where: (fields, { eq }) => eq(fields.id, postId),
    });

    if (!post) {
      return { ok: false, messages: ["Invalid post id 😠"] };
    }
  } catch (error) {
    console.error(error);

    return { ok: false, messages: ["Something went wrong 😭"] };
  }

  try {
    const commentMedia = await db.query.commentsMedia.findMany({
      columns: {
        id: true,
      },
      where: (cm, { eq }) => eq(cm.commentId, commentId),
    });

    const mediaRefs = commentMedia.map((pm) => ref(commentsRef, pm.id));

    await Promise.all(mediaRefs.map((mr) => deleteObject(mr)));

    await Promise.all([
      db.delete(comments).where(eq(comments.id, commentId)),
      db
        .update(posts)
        .set({
          commentsCount: post.commentsCount - 1,
        })
        .where(eq(posts.id, postId)),
    ]);

    return { ok: true, messages: ["Comment deleted successfully 💩"] };
  } catch (error) {
    console.error(error);

    return { ok: false, messages: ["Failed to delete comment 😭"] };
  }
};
