"use server";

import { validateRequest } from "@/lib";
import { ActionResponse, CreateCommentInputsServer, Post } from "@/types";
import { createCommentSchemaServer } from "@/validation";
import { comments, db, commentsMedia, posts } from "@/drizzle";
import { generateId } from "lucia";
import { eq } from "drizzle-orm";

export const createCommentAction = async (
  data: CreateCommentInputsServer,
): Promise<ActionResponse> => {
  const { user } = await validateRequest();

  if (!user) {
    return {
      ok: false,
      messages: [
        "You need to be logged in to create a comment 😠",
        "Why do you have access to this function? 🫵",
        "I'm watching you. Closely 👀",
      ],
    };
  }

  const validatedFields = createCommentSchemaServer.safeParse({
    ...data,
    userId: user.id,
  });

  if (!validatedFields.success) {
    return {
      ok: false,
      messages: validatedFields.error.errors.map(
        (error) => `${error.path}:${error.message}`,
      ),
    };
  }

  if (!validatedFields.data.content && !validatedFields.data.media) {
    return {
      ok: false,
      messages: ["Content or media is required to create a comment 😠"],
    };
  }

  let post: Post | undefined;

  try {
    post = await db.query.posts.findFirst({
      where: (fields, { eq }) => eq(fields.id, validatedFields.data.postId),
    });

    if (!post) {
      return { ok: false, messages: ["The post no longer exists 😭"] };
    }
  } catch (error) {
    console.error(error);

    return { ok: false, messages: ["Something went wrong 😭"] };
  }

  const commentId = generateId(15);

  try {
    await Promise.all([
      db.insert(comments).values({
        id: commentId,
        postId: validatedFields.data.postId,
        userId: validatedFields.data.userId,
        content: validatedFields.data.content,
        createdAt: Date.now(),
      }),
      db
        .update(posts)
        .set({ commentsCount: post.commentsCount + 1 })
        .where(eq(posts.id, validatedFields.data.postId)),
    ]);
  } catch (error) {
    console.error(error);

    return { ok: false, messages: ["Failed to create comment 😭"] };
  }

  if (validatedFields.data.media?.length) {
    try {
      //TODO: multiple media? 🤔
      await db.insert(commentsMedia).values({
        id: validatedFields.data.media[0].id,
        commentId,
        postId: validatedFields.data.postId,
        postCreatedAt: post.createdAt,
        type: validatedFields.data.media[0].type,
        url: validatedFields.data.media[0].url,
      });
    } catch (error) {
      console.error(error);

      await db.delete(comments).where(eq(comments.id, commentId));

      return { ok: false, messages: ["Failed to upload media 😭"] };
    }
  }

  return { ok: true, messages: ["Comment created successfully 💩"] };
};
