import { z } from "zod";

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters"),
    passwordConfirmation: z
      .string()
      .min(1, "Confirmation password is required")
      .min(8, "Password must be at least 8 characters"),
    token: z.string().min(1, "Token is required"),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.passwordConfirmation) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["passwordConfirmation"],
        message: "Passwords do not match",
        fatal: true,
      });
    }
  });
