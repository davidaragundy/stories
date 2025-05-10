import { z } from "zod";

import { credentialsFormSchema } from "@/features/auth/schemas/credentials-form-schema";
import { forgotPasswordFormSchema } from "@/features/auth/schemas/forgot-password-form-schema";
import { magicLinkFormSchema } from "@/features/auth/schemas/magic-link-form-schema";
import { recoveryFormSchema } from "@/features/auth/schemas/recovery-form-schema";
import { resetPasswordFormSchema } from "@/features/auth/schemas/reset-password-form-schema";
import { signUpFormSchema } from "@/features/auth/schemas/sign-up-form-schema";

export type CredentialsFormValues = z.infer<typeof credentialsFormSchema>;
export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordFormSchema>;
export type MagicLinkFormValues = z.infer<typeof magicLinkFormSchema>;
export type RecoveryFormValues = z.infer<typeof recoveryFormSchema>;
export type ResetPasswordFormValues = z.infer<typeof resetPasswordFormSchema>;
export type SignUpFormValues = z.infer<typeof signUpFormSchema>;
