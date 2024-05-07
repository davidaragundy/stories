"use server";

import { validateRequest } from "@/lib";
import { ActionResponse, CreatePostInputsServer } from "@/types";
import { createPostSchemaServer } from "@/validation";
import { db, posts, postsMedia, users } from "@/drizzle";
import { generateId } from "lucia";
import { eq } from "drizzle-orm";

export const createPostAction = async (
  data: CreatePostInputsServer,
): Promise<ActionResponse> => {
  const { user } = await validateRequest();

  if (!user) {
    return {
      ok: false,
      messages: [
        "You need to be logged in to create a post 😠",
        "Why do you have access to this function? 🫵",
        "I'm watching you. Closely 👀",
      ],
    };
  }

  const validatedFields = createPostSchemaServer.safeParse({
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
      messages: ["Content or media is required to create a post 😠"],
    };
  }

  const postId = generateId(15);
  const postCreatedAt = Date.now();

  const userData = await db.query.users.findFirst({
    where: (fields, { eq }) => eq(fields.id, user.id),
    columns: {
      postsCount: true,
    },
  });

  try {
    await Promise.all([
      db
        .update(users)
        .set({
          postsCount: (userData?.postsCount || 0) + 1,
        })
        .where(eq(users.id, user.id)),
      db.insert(posts).values({
        id: postId,
        userId: validatedFields.data.userId,
        content: validatedFields.data.content,
        onlyFollowers: validatedFields.data.onlyFollowers,
        createdAt: postCreatedAt,
      }),
    ]);
  } catch (error) {
    console.error(error);

    return { ok: false, messages: ["Failed to create post 😭"] };
  }

  if (validatedFields.data.media?.length) {
    try {
      //TODO: multiple media? 🤔
      await db.insert(postsMedia).values({
        id: validatedFields.data.media[0].id,
        postId,
        postCreatedAt,
        type: validatedFields.data.media[0].type,
        url: validatedFields.data.media[0].url,
      });
    } catch (error) {
      console.error(error);

      await db.delete(posts).where(eq(posts.id, postId));

      return { ok: false, messages: ["Failed to upload media 😭"] };
    }
  }

  return { ok: true, messages: ["Post created successfully 💩"] };
};
