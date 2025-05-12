import { z } from "zod";

export const forgotPasswordFormSchema = z.object({
  email: z.string().email({
    message: "Email must be a valid email address",
  }),
});
