import { z } from "zod";

import { accountFormSchema } from "@/features/settings/schemas/account-form-schema";
import { notificationsFormSchema } from "@/features/settings/schemas/notifications-form-schema";
import { profileFormSchema } from "@/features/settings/schemas/profile-form-schema";

export type AccountFormValues = z.infer<typeof accountFormSchema>;
export type NotificationsFormValues = z.infer<typeof notificationsFormSchema>;
export type ProfileFormValues = z.infer<typeof profileFormSchema>;
