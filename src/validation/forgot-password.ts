import { z } from "zod";

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .toLowerCase()
    .trim()
    .min(1, "Email is required")
    .email("Invalid email address"),
});
