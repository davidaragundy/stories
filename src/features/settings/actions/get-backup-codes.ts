"use server";

import { auth } from "@/shared/lib/better-auth/server";

export const getBackupCodes = async (userId: string) => {
  const { backupCodes } = await auth.api.viewBackupCodes({
    body: {
      userId,
    },
  });

  return backupCodes;
};
