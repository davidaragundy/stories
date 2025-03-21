import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { APIError } from "better-auth/api";
import { nextCookies } from "better-auth/next-js";
import { username, magicLink, twoFactor } from "better-auth/plugins";

import { BASE_URL } from "@/shared/constants";
import { db, redis } from "@/shared/lib/db/server";
import { ResetPassword, VerifyEmail, MagicLink } from "@/shared/lib/emails";
import { resend } from "@/shared/lib/resend";

export const auth = betterAuth({
  appName: "Stories",
  baseURL: BASE_URL,
  //TODO
  trustedOrigins: ["http://192.168.0.109:3000"],
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  secondaryStorage: {
    get: async (key) => {
      const value = await redis.get<string>(key);
      return value ? value : null;
    },
    set: async (key, value, ttl) => {
      if (ttl) await redis.set(key, value, { ex: ttl });
      else await redis.set(key, value);
    },
    delete: async (key) => {
      await redis.del(key);
    },
  },
  rateLimit: {
    storage: "secondary-storage",
  },
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["emailAndPassword", "github"],
    },
  },
  advanced: {
    cookiePrefix: "stories",
  },
  plugins: [
    nextCookies(),
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
      mapProfileToUser: (profile) => {
        return {
          username: profile.login,
          displayUsername: profile.login,
        };
      },
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      mapProfileToUser: (profile) => {
        return {
          username: profile.email.split("@")[0],
          displayUsername: profile.email.split("@")[0],
        };
      },
    },
  },
});
