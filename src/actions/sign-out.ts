"use server";

import { lucia } from "@/lib";
import { ActionResponse } from "@/types";
import { validateRequest } from "@/lib";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const signOutAction = async (): Promise<ActionResponse> => {
  const { session } = await validateRequest();

  if (!session) {
    return {
      ok: false,
      messages: [
        "You need to be logged in to be able to sign out 😠",
        "Why do you have access to this function? 🫵",
        "I'm watching you. Closely 👀",
      ],
    };
  }

  await lucia.invalidateSession(session.id);

  const sessionCookie = lucia.createBlankSessionCookie();

  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );

  return redirect("/sign-in");
};
