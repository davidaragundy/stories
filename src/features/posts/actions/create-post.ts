"use server";

import { headers } from "next/headers";
import { nanoid } from "nanoid";

import { auth } from "@/shared/lib/better-auth/server";
import { db } from "@/shared/lib/drizzle/server";
import { post } from "@/shared/lib/drizzle/schema";
import { tryCatch } from "@/shared/utils/try-catch";
import type { ActionResponse } from "@/shared/types";

type ErrorCode = "UNAUTHORIZED" | "CONTENT_REQUIRED" | "DATABASE_ERROR";

export const createPost = async (
  content: string
): Promise<ActionResponse<undefined, ErrorCode>> => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return {
      error: {
        code: "UNAUTHORIZED",
        message: "Unauthorized",
      },
    };
  }

  if (!content) {
    return {
      error: {
        code: "CONTENT_REQUIRED",
        message: "Content is required",
      },
    };
  }

  const { error: createPostError } = await tryCatch(
    db.insert(post).values({
      id: nanoid(),
      userId: session.user.id,
      content,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
  );

  if (createPostError) {
    return {
      error: {
        code: "DATABASE_ERROR",
        message: "Failed to create post",
      },
    };
  }

  return {
    data: undefined,
  };
};
