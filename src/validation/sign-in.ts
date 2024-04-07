import { z } from "zod";

export const signInSchema = z.object({
  username: z.string().toLowerCase().trim().min(1, "Username is required"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password should be at least 8 characters long"),
});
