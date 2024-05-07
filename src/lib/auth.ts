import "server-only";

import { Lucia, Session, User as AuthUser } from "lucia";
import { User } from "@/types";
import { DrizzleSQLiteAdapter } from "@lucia-auth/adapter-drizzle";
import { db } from "@/drizzle";
import { sessions, users } from "@/drizzle";
import { cache } from "react";
import { cookies } from "next/headers";

export const adapter = new DrizzleSQLiteAdapter(db, sessions, users);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    expires: false,
    attributes: {
      secure: process.env.NODE_ENV === "production",
    },
  },
  getUserAttributes: (attributes) => ({
    firstName: attributes.firstName,
    lastName: attributes.lastName,
    username: attributes.username,
    email: attributes.email,
    avatarUrl: attributes.avatarUrl,
    createdAt: attributes.createdAt,
    postsCount: attributes.postsCount,
    followersCount: attributes.followersCount,
    followingsCount: attributes.followingsCount,
  }),
});

export const validateRequest = cache(
  async (): Promise<
    { user: AuthUser; session: Session } | { user: null; session: null }
  > => {
    const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;

    if (!sessionId) {
      return {
        user: null,
        session: null,
      };
    }

    const result = await lucia.validateSession(sessionId);

    // next.js throws when you attempt to set cookie when rendering page
    try {
      if (result.session && result.session.fresh) {
        const sessionCookie = lucia.createSessionCookie(result.session.id);

        cookies().set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes,
        );
      }

      if (!result.session) {
        const sessionCookie = lucia.createBlankSessionCookie();

        cookies().set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes,
        );
      }
    } catch {
      /* empty */
    }

    return result;
  },
);

declare module "lucia" {
  export interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: User;
  }
}
