"use server";

import { userByEmail, userByUsername, userCollection } from "@/lib";
import { ActionResponse, SignUpInputs } from "@/types";
import { signUpSchema } from "@/validation";
import { hashSync } from "bcryptjs";
import { v4 as uuid } from "uuid";

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

  const hashedPassword = hashSync(data.password, 10);

  validatedFields.data.password = hashedPassword;

  try {
    const [userByEmailDocument, userByUsernameDocument] = await Promise.all([
      userByEmail.match({
        email: data.email,
      }),
      userByUsername.match({
        username: data.username,
      }),
    ]);

    if (userByEmailDocument.length > 0 || userByUsernameDocument.length > 0) {
      const messages = [];

      if (userByEmailDocument.length > 0) {
        messages.push("email:Email already associated with another account 😢");
      }

      if (userByUsernameDocument.length > 0) {
        messages.push("username:Username already exists 😠");
      }

      return {
        ok: false,
        messages,
      };
    }

    const userId = uuid();

    await userCollection.set(userId, {
      ...validatedFields.data,
      createdAt: Date.now(),
    });
  } catch (error) {
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
