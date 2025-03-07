import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().email({
    message: "Email must be a valid email address",
  }),
  password: z
    .string()
    .min(8, {
      message: "Password must be at least 8 characters long",
    })
    .max(50, {
      message: "Password must be at most 50 characters long",
    }),
});
