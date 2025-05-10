import { z } from "zod";

import { notificationsFormSchema } from "@/features/settings/schemas/notifications-form-schema";

import { changeNameFormSchema } from "@/features/settings/schemas/change-name-form-schema";
import { changeUsernameFormSchema } from "@/features/settings/schemas/change-username-form-schema";
import { changeEmailFormSchema } from "@/features/settings/schemas/change-email-form-schema";

import { changePasswordFormSchema } from "@/features/settings/schemas/change-password-form-schema";
import { toggle2FAFormSchema } from "@/features/settings/schemas/toggle-2fa-form-schema";
import { generateBackupCodesFormSchema } from "@/features/settings/schemas/generate-backup-codes-form-schema";

export type NotificationsFormValues = z.infer<typeof notificationsFormSchema>;

export type ChangeNameFormValues = z.infer<typeof changeNameFormSchema>;
export type ChangeUsernameFormValues = z.infer<typeof changeUsernameFormSchema>;
export type ChangeEmailFormValues = z.infer<typeof changeEmailFormSchema>;

export type ChangePasswordFormValues = z.infer<typeof changePasswordFormSchema>;
export type Toggle2FAFormValues = z.infer<typeof toggle2FAFormSchema>;
export type GenerateBackupCodesFormValues = z.infer<
  typeof generateBackupCodesFormSchema
>;
