import { z } from "zod";

import { twoFactorSchema } from "@/shared/schemas/two-factor-schema";

export type TwoFactorValues = z.infer<typeof twoFactorSchema>;
