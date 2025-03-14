import { createAuthClient } from "better-auth/react";
import {
  usernameClient,
  magicLinkClient,
  twoFactorClient,
} from "better-auth/client/plugins";

export const authClient = createAuthClient({
  plugins: [usernameClient(), magicLinkClient(), twoFactorClient()],
});
