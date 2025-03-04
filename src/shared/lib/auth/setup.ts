import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "@/shared/lib/prisma";
import { resend } from "@/shared/lib/resend";

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    account: {
        accountLinking: {
            enabled: true,
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
                html: `<p>Click <a href="${url}">here</a> to verify your email:</p>`,
            });

            //TODO: way to signal client that email was not sent

            if (error) console.error(error);
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