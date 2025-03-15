import { z } from "zod";

import {
  signInWithCredentialsSchema,
  forgotPasswordSchema,
  recoverySchema,
  signInWithMagicLinkSchema,
  resetPasswordSchema,
  signUpSchema,
} from "@/features/auth/schemas";

export type CredentialsValues = z.infer<typeof signInWithCredentialsSchema>;
export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;
export type RecoveryValues = z.infer<typeof recoverySchema>;
export type MagicLinkValues = z.infer<typeof signInWithMagicLinkSchema>;
export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;
export type SignUpValues = z.infer<typeof signUpSchema>;
