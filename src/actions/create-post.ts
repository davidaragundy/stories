"use server";

import { validateRequest } from "@/lib";
import { ActionResponse } from "@/types";
import { revalidatePath } from "next/cache";
import { UploadApiResponse, v2 as cloudinary } from "cloudinary";
import { createPostSchema } from "@/validation";
import { db, posts, postsMedia } from "@/drizzle";
import { generateId } from "lucia";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

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
    const arrayBuffer = await validatedFields.data.media.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    //TODO: upload multiple media
    //TODO: If the media upload fails, we should delete the post from the db
    //TODO: If db insert fails, we should delete the media from cloudinary

    //Transaction??
    try {
      const uploadResult = (await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: "posts" }, (error, uploadResult) => {
            if (error) {
              return reject(error);
            }

            return resolve(uploadResult!);
          })
          .end(buffer);
      })) as UploadApiResponse;

      await db.insert(postsMedia).values({
        postId,
        type: uploadResult.resource_type,
        url: uploadResult.secure_url,
      });
    } catch (error) {
      console.error(error);

      return { ok: false, messages: ["Failed to upload media 😭"] };
    }
  }

  revalidatePath("/");

  return { ok: true, messages: ["Post created successfully 💩"] };
};
