import { z } from "zod";

export const createPostSchema = z.object({
  content: z.string().optional(),
  media: z
    .instanceof(File)
    .refine((file) => (file ? file.size > 0 : false), {
      message: "Media size should be more than 0.",
    })
    .optional(),
  userId: z.string().min(1, "User ID is required."),
});
