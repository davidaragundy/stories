import { z } from "zod";

export const signUpFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, {
      message: "Name must be at least 2 characters long",
    })
    .max(50, {
      message: "Name must be at most 50 characters long",
    }),
  username: z
    .string()
    .trim()
    .min(3, {
      message: "Username must be at least 3 characters long",
    })
    .max(30, {
      message: "Username must be at most 30 characters long",
    })
    .regex(/^[a-zA-Z0-9_]+$/, {
      message:
        "Username should only contain alphanumeric characters and underscores",
    }),
  email: z.string().trim().email({
    message: "Email must be a valid email address",
  }),
  password: z
    .string()
    .min(8, {
      message: "Password must be at least 8 characters long",
    })
    .max(50, {
      message: "Password must be at most 50 characters long",
    })
    .regex(/[0-9]/, {
      message: "Password must contain at least one number",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter",
    })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter",
    })
    .regex(/[^\w\s]/, {
      message: "Password must contain at least one special character",
    }),
});
