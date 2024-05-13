import { z } from "zod";

export const createMessageSchema = z.object({
  content: z.string().optional(),
  media: z
    .unknown()
    .transform((value) => {
      return value as FileList | undefined;
    })
    .optional(),
  userId: z.string().min(1, "User ID is required."),
});
