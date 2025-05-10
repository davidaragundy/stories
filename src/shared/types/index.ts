import { z } from "zod";

import { twoFactorSchema } from "@/shared/schemas/two-factor-schema";
import { authClient } from "@/shared/lib/better-auth/client";

export type TwoFactorFormValues = z.infer<typeof twoFactorSchema>;

export type Session = typeof authClient.$Infer.Session;

export interface AuthClientError {
  code?: string | undefined;
  message?: string | undefined;
  status: number;
  statusText: string;
}
