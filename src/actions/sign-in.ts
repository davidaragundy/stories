"use server";

import { db } from "@/drizzle";
import { lucia } from "@/lib";
import { ActionResponse, SignInInputs } from "@/types";
import { signInSchema } from "@/validation";
import { cookies } from "next/headers";
import { Argon2id } from "oslo/password";

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

  let existingUser;

  try {
    existingUser = await db.query.users.findFirst({
      where: (users, { eq }) =>
        eq(users.username, validatedFields.data.username),
    });
  } catch (error) {
    return {
      ok: false,
      messages: ["root:Something went wrong. Please try again later 😭"],
    };
  }

  if (!existingUser) {
    // TODO:
    // Returning immediately allows malicious actors to figure out valid usernames from response times,
    // allowing them to only focus on guessing passwords in brute-force attacks.
    // As a preventive measure, we could hash passwords even for invalid usernames.
    // However, valid usernames can be already be revealed with the signup page among other methods.
    // It will also be much more resource intensive.
    // Since protecting against this is non-trivial,
    // it is crucial to implement protection against brute-force attacks with login throttling etc.
    return {
      ok: false,
      messages: ["root:Invalid credentials 😠"],
    };
  }

  const validPassword = await new Argon2id().verify(
    existingUser.password,
    validatedFields.data.password,
  );

  if (!validPassword) {
    return {
      ok: false,
      messages: ["root:Invalid credentials 😠"],
    };
  }

  const session = await lucia.createSession(existingUser.id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);

  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );

  return {
    ok: true,
    messages: ["Successfully signed in! 🎉"],
  };
};
