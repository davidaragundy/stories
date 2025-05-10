import { useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

import { authClient } from "@/shared/lib/better-auth/client";

import { getTxtArrayBuffer } from "@/features/settings/utils/get-txt-array-buffer";
import type { GenerateBackupCodesFormValues } from "@/features/settings/types";

interface Props {
  form: UseFormReturn<GenerateBackupCodesFormValues>;
}

export const useGenerateBackupCodesMutation = ({ form }: Props) => {
  const toastId = useRef<string | number>("");

  return useMutation({
    mutationFn: async ({ password }: { password: string }) => {
      const { data, error } = await authClient.twoFactor.generateBackupCodes({
        password,
      });

      if (error) {
        throw new Error(error.message, { cause: error });
      }

      return data;
    },
    onMutate: () => {
      toastId.current = toast.loading("Generating backup codes...");
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
        id: toastId.current,
        duration: 5000,
      });

      form.reset();
    },
    onError: () => {
      toast.error(
        "Failed to generate backup codes, please try again later 😢",
        {
          id: toastId.current,
          duration: 10000,
        }
      );
    },
  });
};
