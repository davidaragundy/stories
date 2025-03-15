import { z } from "zod";

import {
  accountFormSchema,
  notificationsFormSchema,
  profileFormSchema,
} from "@/features/settings/schemas";

export type AccountFormValues = z.infer<typeof accountFormSchema>;
export type NotificationsFormValues = z.infer<typeof notificationsFormSchema>;
export type ProfileFormValues = z.infer<typeof profileFormSchema>;
