import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useSession } from "@/shared/hooks/use-session";
import { tryCatch } from "@/shared/utils/try-catch";

import { useEnable2FAMutation } from "@/features/settings/hooks/use-enable-2fa-mutation";
import { useDisable2FAMutation } from "@/features/settings/hooks/use-disable-2fa-mutation";
import { toggle2FAFormSchema } from "@/features/settings/schemas/toggle-2fa-form-schema";
import type { Toggle2FAFormValues } from "@/features/settings/types";

export const useToggle2FAForm = () => {
  const {
    data: session,
    isSuccess: isSessionSuccess,
    isLoading: isSessionLoading,
    isError: isSessionError,
    refetch: refetchSession,
    isRefetching: isSessionRefetching,
  } = useSession();

  const form = useForm<Toggle2FAFormValues>({
    resolver: zodResolver(toggle2FAFormSchema),
    defaultValues: {
      enable2FA: !!session?.user.twoFactorEnabled,
      currentPassword: "",
    },
    values: {
      enable2FA: !!session?.user.twoFactorEnabled,
      currentPassword: "",
    },
  });

  const [totpURI, setTotpURI] = useState<string>("");
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const dialogTriggerRef = useRef<HTMLButtonElement>(null);

  const { mutateAsync: enable2FA, isPending: isEnable2FAPending } =
    useEnable2FAMutation({
      form,
      setTotpURI,
      setBackupCodes,
      dialogTriggerRef,
    });

  const { mutateAsync: disable2FA, isPending: isDisable2FAPending } =
    useDisable2FAMutation({
      form,
    });

  async function onSubmit(values: Toggle2FAFormValues) {
    if (values.enable2FA) {
      await tryCatch(
        enable2FA({
          password: values.currentPassword,
        })
      );

      return;
    }

    if (!values.enable2FA) {
      await tryCatch(
        disable2FA({
          password: values.currentPassword,
        })
      );
    }
  }

  return {
    form,
    onSubmit,
    isPending: isEnable2FAPending || isDisable2FAPending,
    isSessionSuccess,
    isSessionLoading,
    isSessionError,
    refetchSession,
    isSessionRefetching,
    totpURI,
    setTotpURI,
    backupCodes,
    setBackupCodes,
    dialogTriggerRef,
  };
};
