import {
  createCommentSchemaClient,
  createCommentSchemaServer,
  createMessageSchema,
  createPostSchemaClient,
  createPostSchemaServer,
  forgotPasswordSchema,
  resetPasswordSchema,
  signInSchema,
  signUpSchema,
} from "@/validation";
import { z } from "zod";

export type SignInInputs = z.infer<typeof signInSchema>;

export type SignUpInputs = z.infer<typeof signUpSchema>;

export type CreatePostInputsClient = z.infer<typeof createPostSchemaClient>;
export type CreatePostInputsServer = z.infer<typeof createPostSchemaServer>;

export type CreateCommentInputsClient = z.infer<
  typeof createCommentSchemaClient
>;
export type CreateCommentInputsServer = z.infer<
  typeof createCommentSchemaServer
>;

export type ForgotPasswordInputs = z.infer<typeof forgotPasswordSchema>;

export type ResetPasswordInputs = z.infer<typeof resetPasswordSchema>;

export type CreateMessageInputs = z.infer<typeof createMessageSchema>;
