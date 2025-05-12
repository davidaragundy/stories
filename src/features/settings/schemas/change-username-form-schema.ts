import { z } from "zod";

export const changeUsernameFormSchema = z.object({
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
});
