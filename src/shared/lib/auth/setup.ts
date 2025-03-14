import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { APIError } from "better-auth/api";
import { username, magicLink, twoFactor } from "better-auth/plugins";
import { BASE_URL } from "@/shared/constants";
import prisma from "@/shared/lib/prisma";
import {
  ResetPassword,
  VerifyEmail,
  MagicLink,
} from "@/shared/lib/react-email";
import { resend } from "@/shared/lib/resend";

export const auth = betterAuth({
  appName: "Stories",
  baseURL: BASE_URL,
  //TODO: update
  trustedOrigins: ["http://192.168.0.120:3000"],
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["emailAndPassword", "github"],
    },
  },
  plugins: [
    username(),
    magicLink({
      disableSignUp: true,
      sendMagicLink: async ({ email, url }) => {
        const { error } = await resend.emails.send({
          from: "Stories <mail@stories.aragundy.com>",
          to: [email],
          subject: "Sign in with Magic Link",
          react: MagicLink({ url }),
        });

        if (error) {
          console.error(error);

          throw new APIError("FAILED_DEPENDENCY", {
            message: "Failed to send magic link",
          });
        }
      },
    }),
    twoFactor(),
  ],
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      const { error } = await resend.emails.send({
        from: "Stories <mail@stories.aragundy.com>",
        to: [user.email],
        subject: "Verify your email address",
        react: VerifyEmail({ name: user.name, url }),
      });

      if (error) {
        console.error(error);

        throw new APIError("FAILED_DEPENDENCY", {
          message: "Failed to send verification email",
        });
      }
    },
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      const { error } = await resend.emails.send({
        from: "Stories <mail@stories.aragundy.com>",
        to: [user.email],
        subject: "Reset your password",
        react: ResetPassword({ name: user.name, url }),
      });

      if (error) {
        console.error(error);

        throw new APIError("FAILED_DEPENDENCY", {
          message: "Failed to send reset password email",
        });
      }
    },
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
  },
});
