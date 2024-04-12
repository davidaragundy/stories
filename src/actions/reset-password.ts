"use server";

import { db, invalidResetPasswordTokens, users } from "@/drizzle";
import { ActionResponse, ResetPasswordInputs } from "@/types";
import { resetPasswordSchema } from "@/validation";
import { eq } from "drizzle-orm";
import { decodeHex } from "oslo/encoding";
import { JWT, parseJWT, validateJWT } from "oslo/jwt";
import { Argon2id } from "oslo/password";

export const resetPasswordAction = async (
  data: ResetPasswordInputs,
): Promise<ActionResponse> => {
  const validatedFields = resetPasswordSchema.safeParse({
    ...data,
  });

  if (!data.token) {
    return {
      ok: false,
      messages: ["root:Token is required 😠"],
    };
  }

  if (!validatedFields.success) {
    return {
      ok: false,
      messages: validatedFields.error.errors.map(
        (error) => `${error.path}:${error.message}`,
      ),
    };
  }

  if (data.password !== data.passwordConfirmation) {
    return {
      ok: false,
      messages: ["passwordConfirmation:Passwords do not match"],
    };
  }

  const secret = decodeHex(process.env.FORGOT_PASSWORD_SECRET!);

  let token: JWT;

  try {
    token = await validateJWT("HS256", secret, data.token);
  } catch (error) {
    if (error instanceof Error && error.message.includes("Invalid")) {
      return {
        ok: false,
        messages: ["root:Invalid token 😠"],
      };
    }

    token = parseJWT(data.token)!;
  }

  const userId = (token.payload as { userId: string }).userId;

  try {
    const invalidToken = await db.query.invalidResetPasswordTokens.findFirst({
      where: (fields, { eq }) => eq(fields.token, validatedFields.data.token),
    });

    if (invalidToken) {
      return {
        ok: false,
        messages: ["root:Invalid token 😠"],
      };
    }

    const hashedPassword = await new Argon2id().hash(
      validatedFields.data.password,
    );

    const existingUser = await db.query.users.findFirst({
      where: (fields, { eq }) => eq(fields.id, userId),
      columns: {
        password: true,
      },
    });

    if (!existingUser) {
      return {
        ok: false,
        messages: ["root:Invalid user 😠"],
      };
    }

    const isSamePassword = await new Argon2id().verify(
      existingUser.password,
      validatedFields.data.password,
    );

    if (isSamePassword) {
      return {
        ok: false,
        messages: ["password:Password must be different from the current one"],
      };
    }

    await Promise.all([
      db.insert(invalidResetPasswordTokens).values({
        token: validatedFields.data.token,
      }),
      db
        .update(users)
        .set({
          password: hashedPassword,
        })
        .where(eq(users.id, userId)),
    ]);
  } catch (error) {
    console.error(error);

    return {
      ok: false,
      messages: ["root:Something went wrong. Please try again later. 😭"],
    };
  }

  return {
    ok: true,
    messages: ["The password has been reset successfully"],
  };
};
