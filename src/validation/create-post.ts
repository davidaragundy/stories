import { z } from "zod";

export const createPostSchemaClient = z.object({
  content: z.string().optional(),
  media: z
    .unknown()
    .transform((value) => {
      return value as FileList | undefined;
    })
    .optional(),
  userId: z.string().min(1, "User ID is required."),
  onlyFollowers: z
    .string()
    .refine((value) => {
      return ["true", "false"].includes(value);
    }, "onlyFollowers must be true or false.")
    .default("false"),
});

export const createPostSchemaServer = z.object({
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
  onlyFollowers: z
    .string()
    .refine((value) => {
      return ["true", "false"].includes(value);
    }, "onlyFollowers must be true or false.")
    .default("false"),
});
