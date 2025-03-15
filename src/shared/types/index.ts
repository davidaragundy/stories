import { z } from "zod";

import { twoFactorSchema } from "@/shared/schemas";

export type TwoFactorValues = z.infer<typeof twoFactorSchema>;
