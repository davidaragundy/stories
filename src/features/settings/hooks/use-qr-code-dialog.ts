import { Dispatch, SetStateAction, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { twoFactorSchema } from "@/shared/schemas/two-factor-schema";
import type { TwoFactorFormValues } from "@/shared/types";

import { useVerifyTotpMutation } from "@/features/settings/hooks/use-verify-totp-mutation";
import { getTxtArrayBuffer } from "@/features/settings/utils/get-txt-array-buffer";

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
  const form = useForm<TwoFactorFormValues>({
    resolver: zodResolver(twoFactorSchema),
    defaultValues: {
      code: "",
    },
  });

  const [showBackupCodes, setShowBackupCodes] = useState(false);
  const dialogCloseRef = useRef<HTMLButtonElement>(null);

  const key = URI ? new URL(URI).searchParams.get("secret")! : "";

  const { mutate, isPending, isError } = useVerifyTotpMutation({
    form,
    setTotpURI,
    setShowBackupCodes,
  });

  const onSubmit = (values: TwoFactorFormValues) =>
    mutate({
      code: values.code,
    });

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
    setShowBackupCodes(false);
    dialogCloseRef.current?.click();
  };

  return {
    form,
    onSubmit,
    isPending,
    isError,
    key,
    showBackupCodes,
    setShowBackupCodes,
    handleDownloadBackupCodes,
    dialogCloseRef,
  };
};
