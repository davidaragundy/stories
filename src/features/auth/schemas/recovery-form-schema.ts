import { z } from "zod";

export const recoveryFormSchema = z.object({
  code: z.string().length(11),
});
