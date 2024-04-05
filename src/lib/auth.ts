// import "server-only";

import { compareSync } from "bcryptjs";
import type { NextAuthConfig } from "next-auth";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { userByUsername } from "@/lib";
import { getUser } from "@/utils";
import { User } from "@/types";
import type { AdapterUser } from "next-auth/adapters";

export const config = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { username, password } = credentials as {
          username: string;
          password: string;
        };

        try {
          const userDocument = await userByUsername.match({
            username,
          });

          if (userDocument.length === 0) {
            return null;
          }

          const user = getUser(userDocument[0]);

          if (!compareSync(password, user.password as string)) {
            return null;
          }

          return { ...user, password: undefined };
        } catch (error) {
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/signIn",
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.user = user;
      }

      return token;
    },
    session({ session, token }) {
      session.user = token.user as AdapterUser & Omit<User, "password">;

      return session;
    },
  },
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(config);
