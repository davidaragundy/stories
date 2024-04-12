"use server";

import { db } from "@/drizzle";
import { createJWT } from "oslo/jwt";
import { ActionResponse, ForgotPasswordInputs } from "@/types";
import { forgotPasswordSchema } from "@/validation";
import { TimeSpan } from "lucia";
import { decodeHex } from "oslo/encoding";
import { transporter } from "@/lib";
import { ResetPasswordEmail } from "@/components/emails";
import { BASE_URL } from "@/constants";
import { renderAsync } from "@react-email/render";

export const forgotPasswordAction = async (
  data: ForgotPasswordInputs,
): Promise<ActionResponse> => {
  const validatedFields = forgotPasswordSchema.safeParse({
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

  const existingUser = await db.query.users.findFirst({
    where: (fields, operators) =>
      operators.eq(fields.email, validatedFields.data.email),
  });

  if (existingUser) {
    try {
      const secret = decodeHex(process.env.FORGOT_PASSWORD_SECRET!);

      const payload = {
        userId: existingUser.id,
      };

      const token = await createJWT("HS256", secret, payload, {
        expiresIn: new TimeSpan(5, "m"),
        issuer: "stories",
        subject: "forgot-password",
        includeIssuedTimestamp: true,
      });

      const emailHtml = await renderAsync(
        ResetPasswordEmail({
          userFirstName: existingUser.firstName,
          resetPasswordLink: `${BASE_URL}/forgot-password/${token}`,
        }),
      );

      const options = {
        from: "Stories <stories@aragundy.xyz>",
        to: existingUser.email,
        subject: "Reset password | Stories",
        html: emailHtml,
      };

      await transporter.sendMail(options);
    } catch (error) {
      console.error(error);

      return {
        ok: false,
        messages: ["root:Something went wrong. Please try again later. 😭"],
      };
    }
  }

  return {
    ok: true,
    messages: [
      "We have sent you an email with instructions to reset your password. 📧",
    ],
  };
};
