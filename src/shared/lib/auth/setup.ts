import { betterAuth } from "better-auth";
import { APIError } from "better-auth/api";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "@/shared/lib/prisma";
import { resend } from "@/shared/lib/resend";
import { VerifyEmail } from "@/shared/lib/react-email";
import { BASE_URL } from "@/shared/constants";

export const auth = betterAuth({
    baseURL: BASE_URL,
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    account: {
        accountLinking: {
            enabled: true,
            trustedProviders: ["emailAndPassword", "github"],
        }
    },
    emailVerification: {
        sendOnSignUp: true,
        autoSignInAfterVerification: true,
        sendVerificationEmail: async ({ user, url }) => {
            const { error } = await resend.emails.send({
                from: "Stories <mail@stories.aragundy.com>",
                to: [user.email],
                subject: 'Verify your email address',
                react: VerifyEmail({ name: user.name, url }),
            });

            if (error) {
                console.error(error);

                throw new APIError("FAILED_DEPENDENCY", {
                    message: "Failed to send verification email"
                });
            };
        },
    },
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: true,
    },
    socialProviders: {
        github: {
            clientId: process.env.GITHUB_CLIENT_ID as string,
            clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
        }
    },
});