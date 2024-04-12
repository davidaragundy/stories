import {
  createPostSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  signInSchema,
  signUpSchema,
} from "@/validation";
import { z } from "zod";

export type SignInInputs = z.infer<typeof signInSchema>;
export type SignUpInputs = z.infer<typeof signUpSchema>;
export type CreatePostInputs = z.infer<typeof createPostSchema>;
export type ForgotPasswordInputs = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInputs = z.infer<typeof resetPasswordSchema>;
