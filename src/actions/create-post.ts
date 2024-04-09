"use server";

import { postsRef, validateRequest } from "@/lib";
import { ActionResponse } from "@/types";
import { revalidatePath } from "next/cache";
import { createPostSchema } from "@/validation";
import { db, posts, postsMedia } from "@/drizzle";
import { generateId } from "lucia";
import { eq } from "drizzle-orm";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

export const createPostAction = async (
  _previousState: ActionResponse,
  formData: FormData,
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

  if ((formData.get("media") as File).size === 0) {
    formData.delete("media");
  }

  const validatedFields = createPostSchema.safeParse({
    userId: user.id,
    ...Object.fromEntries(formData),
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

  try {
    await db.insert(posts).values({
      id: postId,
      userId: validatedFields.data.userId,
      content: validatedFields.data.content,
      createdAt: Date.now(),
    });
  } catch (error) {
    console.error(error);

    return { ok: false, messages: ["Failed to create post 😭"] };
  }

  if (validatedFields.data.media) {
    try {
      const mediaId = `${generateId(15)}.${validatedFields.data.media.type.split("/")[1]}`;

      const mediaRef = ref(postsRef, mediaId);

      await uploadBytes(mediaRef, validatedFields.data.media);

      const mediaUrl = await getDownloadURL(mediaRef);

      await db.insert(postsMedia).values({
        id: mediaId,
        postId,
        type: validatedFields.data.media.type.split("/")[0],
        url: mediaUrl,
      });
    } catch (error) {
      console.error(error);

      await db.delete(posts).where(eq(posts.id, postId));

      return { ok: false, messages: ["Failed to upload media 😭"] };
    }
  }

  revalidatePath("/");

  return { ok: true, messages: ["Post created successfully 💩"] };
};
