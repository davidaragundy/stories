import { Dispatch, SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { authClient } from "@/shared/lib/auth/client";
import { twoFactorSchema } from "@/shared/schemas";
import { TwoFactorValues } from "@/shared/types";

import { getTxtArrayBuffer } from "@/features/settings/utils";

import { toast } from "sonner";

interface Props {
  URI: string;
  setTotpURI: Dispatch<SetStateAction<string>>;
  backupCodes: string[];
  setBackupCodes: Dispatch<SetStateAction<string[]>>;
}

export const useQrCodeDialog = ({
  URI,
  setTotpURI,
  backupCodes,
  setBackupCodes,
}: Props) => {
  const form = useForm<TwoFactorValues>({
    resolver: zodResolver(twoFactorSchema),
    defaultValues: {
      code: "",
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showBackupCodes, setShowBackupCodes] = useState(false);

  const key = URI ? new URL(URI).searchParams.get("secret") : "";

  async function onSubmit(values: TwoFactorValues) {
    setIsLoading(true);

    const { error } = await authClient.twoFactor.verifyTotp({
      code: values.code,
    });

    setIsLoading(false);

    if (error) {
      if (error.status === 429) return;

      switch (error.code) {
        case "INVALID_TWO_FACTOR_AUTHENTICATION":
          form.setError("code", {
            message: "Invalid one-time password",
          });
          return;

        default:
          toast.error("An error occurred, please try again later 😢");
          return;
      }
    }

    toast.success("Two-factor authentication enabled successfully 🎉");
    setTotpURI("");
    setShowBackupCodes(true);
  }

  const handleDownloadBackupCodes = () => {
    const buffer = getTxtArrayBuffer(backupCodes);

    const blob = new Blob([buffer], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "stories-backup-codes.txt";
    a.click();

    URL.revokeObjectURL(url);
    setBackupCodes([]);
  };

  return {
    form,
    isLoading,
    showBackupCodes,
    setShowBackupCodes,
    key,
    onSubmit,
    handleDownloadBackupCodes,
  };
};
