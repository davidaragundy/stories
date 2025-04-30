import { z } from "zod";

import {
  signInWithCredentialsSchema,
  signInWithMagicLinkSchema,
} from "@/features/auth/schemas/sign-in-schema";
import { forgotPasswordSchema } from "@/features/auth/schemas/forgot-password-schema";
import { recoverySchema } from "@/features/auth/schemas/recovery-schema";
import { resetPasswordSchema } from "@/features/auth/schemas/reset-password-schema";
import { signUpSchema } from "@/features/auth/schemas/sign-up-schema";

export type CredentialsValues = z.infer<typeof signInWithCredentialsSchema>;
export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;
export type RecoveryValues = z.infer<typeof recoverySchema>;
export type MagicLinkValues = z.infer<typeof signInWithMagicLinkSchema>;
export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;
export type SignUpValues = z.infer<typeof signUpSchema>;
