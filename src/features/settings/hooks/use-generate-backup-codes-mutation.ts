import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

import { authClient } from "@/shared/lib/better-auth/client";
import { SESSION_QUERY_KEY } from "@/shared/lib/react-query/query-key-factory";

import { getTxtArrayBuffer } from "@/features/settings/utils/get-txt-array-buffer";
import type { GenerateBackupCodesFormValues } from "@/features/settings/types";

interface Props {
  form: UseFormReturn<GenerateBackupCodesFormValues>;
}

export const useGenerateBackupCodesMutation = ({ form }: Props) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ password }: { password: string }) => {
      const { data, error } = await authClient.twoFactor.generateBackupCodes({
        password,
      });

      if (error) return Promise.reject(error);

      return data;
    },
    onSuccess: (data) => {
      const buffer = getTxtArrayBuffer(data.backupCodes);

      const blob = new Blob([buffer], { type: "text/plain" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "stories-backup-codes.txt";
      a.click();

      URL.revokeObjectURL(url);

      toast.success("Backup codes generated successfully 🎉", {
        duration: 10_000,
      });

      form.reset();
    },
    onError: () => {
      toast.error("Failed to generate backup codes 😢", {
        description: "Please try again later",
        duration: 10_000,
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [SESSION_QUERY_KEY] });
    },
  });
};
