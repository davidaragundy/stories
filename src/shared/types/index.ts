import { z } from "zod";

import { twoFactorSchema } from "@/shared/schemas/two-factor-schema";
import { authClient } from "@/shared/lib/better-auth/client";
import { user } from "@/shared/lib/drizzle/schema";

export type TwoFactorFormValues = z.infer<typeof twoFactorSchema>;

export type Session = typeof authClient.$Infer.Session;
export interface AuthClientError {
  code?: string | undefined;
  message?: string | undefined;
  status: number;
  statusText: string;
}

export type ActionResponse<T> = {
  data?: T;
  error?: {
    message: string;
  };
};

export type User = typeof user.$inferSelect;
