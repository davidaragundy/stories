import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Session, authClient } from "@/shared/lib/auth/client";

import { accountFormSchema } from "@/features/settings/schemas";
import { AccountFormValues } from "@/features/settings/types";

import { toast } from "sonner";

export const useAccountForm = (session: Session) => {
  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: {
      enable2FA: !!session.user.twoFactorEnabled,
      password: "",
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const [totpURI, setTotpURI] = useState<string>("");
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const dialogTriggerRef = useRef<HTMLButtonElement>(null);

  async function onSubmit(values: AccountFormValues) {
    const toastId = toast.loading("Updating account...");
    setIsLoading(true);

    if (values.enable2FA) {
      const { data, error } = await authClient.twoFactor.enable({
        password: values.password,
      });

      setIsLoading(false);

      if (error) {
        if (error.status === 429) return;

        switch (error.code) {
          case "INVALID_PASSWORD":
            form.setError("password", {
              message: "Invalid password",
            });
            toast.dismiss(toastId);
            return;

          default:
            toast.error("Failed to enable 2FA, please try again later 😢", {
              id: toastId,
              duration: 10000,
            });
            return;
        }
      }

      toast.dismiss(toastId);

      setTotpURI(data.totpURI);
      setBackupCodes(data.backupCodes);
      dialogTriggerRef.current?.click();

      return;
    }

    if (!values.enable2FA) {
      const { error } = await authClient.twoFactor.disable({
        password: values.password,
      });

      setIsLoading(false);

      if (error) {
        if (error.status === 429) return;

        switch (error.code) {
          case "INVALID_PASSWORD":
            form.setError("password", {
              message: "Invalid password",
            });
            toast.dismiss(toastId);
            return;

          default:
            toast.error("Failed to disable 2FA, please try again later 😢", {
              id: toastId,
              duration: 10000,
            });
            return;
        }
      }

      toast.success("2FA has been disabled successfully 🎉", {
        id: toastId,
        duration: 5000,
      });

      return;
    }
  }

  return {
    form,
    isLoading,
    onSubmit,
    totpURI,
    setTotpURI,
    backupCodes,
    setBackupCodes,
    dialogTriggerRef,
  };
};
