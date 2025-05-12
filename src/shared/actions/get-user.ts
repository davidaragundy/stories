"use server";

import { eq, or } from "drizzle-orm";

import { db } from "@/shared/lib/drizzle/server";
import { user } from "@/shared/lib/drizzle/schema";
import { tryCatch } from "@/shared/utils/try-catch";
import type { ActionResponse, User } from "@/shared/types";

interface Props {
  id?: string;
  username?: string;
}

export const getUser = async ({
  id,
  username,
}: Props): Promise<ActionResponse<User>> => {
  if (!id && !username)
    return {
      error: {
        message: "Either id or username is required",
      },
    };

  const { data, error } = await tryCatch(
    db
      .select()
      .from(user)
      .where(or(eq(user.id, id ?? ""), eq(user.username, username ?? "")))
      .limit(1)
  );

  if (error)
    return {
      error: {
        message: "Something went wrong while fetching the user data 😢",
      },
    };

  if (!data || data.length === 0)
    return {
      error: {
        message: "User not found",
      },
    };

  return {
    data: data[0],
  };
};
