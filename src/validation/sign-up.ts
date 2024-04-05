import { z } from "zod";

export const signUpSchema = z.object({
  username: z.string().min(1, "Username is required"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password should be at least 8 characters long"),
  avatarUrl: z.string().min(1, "Avatar URL is required"),
});
