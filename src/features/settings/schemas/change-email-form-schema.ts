import { z } from "zod";

export const changeEmailFormSchema = z.object({
  email: z.string().trim().email({
    message: "Email must be a valid email address",
  }),
});
