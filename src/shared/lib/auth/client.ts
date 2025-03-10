import { createAuthClient } from "better-auth/react";
import { usernameClient, magicLinkClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  plugins: [usernameClient(), magicLinkClient()],
});
