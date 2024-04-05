import { createPostSchema, signInSchema, signUpSchema } from "@/validation";
import { z } from "zod";

export type SignInInputs = z.infer<typeof signInSchema>;
export type SignUpInputs = z.infer<typeof signUpSchema>;
export type CreatePostInputs = z.infer<typeof createPostSchema>;
