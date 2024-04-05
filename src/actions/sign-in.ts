"use server";

import { signIn } from "@/lib";
import { ActionResponse, SignInInputs } from "@/types";
import { signInSchema } from "@/validation";
import { AuthError } from "next-auth";
import { isRedirectError } from "next/dist/client/components/redirect";

export const signInAction = async (
  data: SignInInputs,
): Promise<ActionResponse> => {
  const validatedFields = signInSchema.safeParse({
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

  try {
    await signIn("credentials", {
      ...validatedFields.data,
    });

    return {
      ok: true,
      messages: ["Signed in successfully!"],
    };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    if (error instanceof AuthError) {
      return {
        ok: false,
        messages: ["root:Invalid credentials 😠"],
      };
    }

    return {
      ok: false,
      messages: ["root:Something went wrong. Please try again later 😭"],
    };
  }
};
