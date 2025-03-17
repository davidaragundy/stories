import { createAuthClient } from "better-auth/react";
import {
  usernameClient,
  magicLinkClient,
  twoFactorClient,
} from "better-auth/client/plugins";

import { toast } from "sonner";

export const authClient = createAuthClient({
  plugins: [usernameClient(), magicLinkClient(), twoFactorClient()],
  fetchOptions: {
    onError: async (context) => {
      const { response } = context;

      if (response.status === 429) {
        toast.error("Rate limit exceeded 🚫", {
          duration: 10_000,
          description: "Try again later, take a break!",
        });
      }
    },
  },
});

export type Session = typeof authClient.$Infer.Session;
