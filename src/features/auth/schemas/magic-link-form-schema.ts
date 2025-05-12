import { z } from "zod";

export const magicLinkFormSchema = z.object({
  email: z.string().trim().email({
    message: "Invalid email address",
  }),
});
