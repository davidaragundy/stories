"use server";

import { db } from "@/drizzle";
import { isValidToken } from "@/utils";

export const isValidResetPasswordToken = async (
  token: string,
): Promise<boolean> => {
  try {
    const [isValid, existingInvalidToken] = await Promise.all([
      isValidToken(token),
      db.query.invalidResetPasswordTokens.findFirst({
        where: (fields, { eq }) => eq(fields.token, token),
      }),
    ]);

    if (!isValid || existingInvalidToken) {
      return false;
    }

    return true;
  } catch (error) {
    return false;
  }
};
