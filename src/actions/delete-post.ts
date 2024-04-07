"use server";

import { validateRequest, postCollection } from "@/lib";
import { ActionResponse } from "@/types";
import { revalidatePath } from "next/cache";
import { v2 as cloudinary } from "cloudinary";
import { getMediaPublicId } from "@/utils";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const deletePostAction = async (
  postId: string,
): Promise<ActionResponse> => {
  const { user, session } = await validateRequest();

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
    const postDoc = await postCollection.get(postId);

    if (!postDoc) {
      return { ok: false, messages: ["Invalid post id 😠"] };
    }

    if (postDoc.data.userId !== user.id) {
      return {
        ok: false,
        messages: ["You can only delete your own posts 😠"],
      };
    }

    if (postDoc.data.media.length > 0) {
      await cloudinary.api.delete_resources(
        postDoc.data.media.map((m) => `posts/${getMediaPublicId(m.url)}`),
      );
    }

    await postCollection.delete(postId);

    revalidatePath("/");

    return { ok: true, messages: ["Post deleted successfully 💩"] };
  } catch (error) {
    console.error(error);

    return { ok: false, messages: ["Failed to delete post 😭"] };
  }
};
