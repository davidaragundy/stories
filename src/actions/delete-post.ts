"use server";

import { validateRequest } from "@/lib";
import { ActionResponse } from "@/types";
import { revalidatePath } from "next/cache";
import { v2 as cloudinary } from "cloudinary";
import { getMediaPublicId } from "@/utils";
import { db, posts } from "@/drizzle";
import { eq } from "drizzle-orm";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

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

  //TODO: If the cloudinary delete fails, the post should not be deleted from the database
  try {
    const postMedia = await db.query.postsMedia.findMany({
      where: (pm, { eq }) => eq(pm.postId, postId),
    });

    if (postMedia.length > 0) {
      await cloudinary.api.delete_resources(
        postMedia.map((m) => `posts/${getMediaPublicId(m.url)}`),
      );
    }

    await db.delete(posts).where(eq(posts.id, postId));

    revalidatePath("/");

    return { ok: true, messages: ["Post deleted successfully 💩"] };
  } catch (error) {
    console.error(error);

    return { ok: false, messages: ["Failed to delete post 😭"] };
  }
};
