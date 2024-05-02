import { z } from "zod";

export const createCommentSchemaClient = z.object({
  content: z.string().optional(),
  media: z
    .unknown()
    .transform((value) => {
      return value as FileList | undefined;
    })
    .optional(),
  userId: z.string().min(1, "User ID is required."),
  postId: z.string().min(1, "Post ID is required."),
  parentId: z.string().min(1, "Parent ID is required.").nullable(),
});

export const createCommentSchemaServer = z.object({
  content: z.string().optional(),
  media: z
    .object({
      id: z.string(),
      type: z.string(),
      url: z.string(),
    })
    .array()
    .optional(),
  userId: z.string().min(1, "User ID is required."),
  postId: z.string().min(1, "Post ID is required."),
  parentId: z.string().min(1, "Parent ID is required.").nullable(),
});
