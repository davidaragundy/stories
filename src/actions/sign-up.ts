"use server";

import { db, users } from "@/drizzle";
import { ActionResponse, SignUpInputs } from "@/types";
import { signUpSchema } from "@/validation";
import { LibsqlError } from "@libsql/client";
import { generateId } from "lucia";
import { Argon2id } from "oslo/password";

export const signUpAction = async (
  data: SignUpInputs,
): Promise<ActionResponse> => {
  const validatedFields = signUpSchema.safeParse({
    ...data,
  });

  if (!validatedFields.success) {
    return {
      ok: false,
      messages: validatedFields.error.errors.map(
        (error) => `${error.path}:${error.message}`,
      ),
    };
  }

  const hashedPassword = await new Argon2id().hash(
    validatedFields.data.password,
  );
  const userId = generateId(15);

  validatedFields.data.password = hashedPassword;

  try {
    await db.insert(users).values({
      id: userId,
      ...validatedFields.data,
      createdAt: Date.now(),
    });
  } catch (error) {
    if (error instanceof LibsqlError && error.message.includes("UNIQUE")) {
      const messages = [];

      if (error.message.includes("email")) {
        messages.push("email:Email already associated with another account 😢");
      }

      if (error.message.includes("username")) {
        messages.push("username:Username already exists 😠");
      }

      return {
        ok: false,
        messages,
      };
    }

    return {
      ok: false,
      messages: ["root:Something went wrong. Please try again later 😭"],
    };
  }

  return {
    ok: true,
    messages: ["Account created successfully!"],
  };
};
