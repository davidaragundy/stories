"use server";

import { auth, postCollection } from "@/lib";
import { ActionResponse, Media } from "@/types";
import { revalidatePath } from "next/cache";
import { v4 as uuid } from "uuid";
import { UploadApiResponse, v2 as cloudinary } from "cloudinary";
import { createPostSchema } from "@/validation";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const createPostAction = async (
  _previousState: ActionResponse,
  formData: FormData,
): Promise<ActionResponse> => {
  const session = await auth();

  if (!session) {
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
    userId: session?.user.id,
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

  let media: Media[] = [];

  if (validatedFields.data.media) {
    const arrayBuffer = await validatedFields.data.media.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

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

      media.push({
        type: uploadResult.resource_type as "image" | "video",
        url: uploadResult.secure_url,
      });
    } catch (error) {
      console.error(error);

      return { ok: false, messages: ["Failed to upload media 😭"] };
    }
  }

  try {
    const postId = uuid();

    await postCollection.set(postId, {
      content: validatedFields.data.content || "",
      userId: validatedFields.data.userId,
      media: media,
      createdAt: Date.now(),
      reactions: {
        cap: 0,
        fire: 0,
        poop: 0,
      },
    });

    await postCollection.redis.expire(
      postCollection.documentKey(postId),
      60 * 60 * 24,
    );

    revalidatePath("/");

    return { ok: true, messages: ["Post created successfully 💩"] };
  } catch (error) {
    console.error(error);

    return { ok: false, messages: ["Failed to create post 😭"] };
  }
};
