"use server";

import { auth, signOut } from "@/lib";
import { ActionResponse } from "@/types";

export const signOutAction = async (): Promise<ActionResponse | void> => {
  const session = await auth();

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

  await signOut();
};
