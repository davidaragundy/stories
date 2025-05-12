import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useSession } from "@/shared/hooks/use-session";

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
    values: {
      enable2FA: !!session?.user.twoFactorEnabled,
      currentPassword: "",
    },
  });

  const [totpURI, setTotpURI] = useState<string>("");
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const dialogTriggerRef = useRef<HTMLButtonElement>(null);

  const {
    mutate: enable2FA,
    isPending: isEnable2FAPending,
    isError: isEnable2FAError,
  } = useEnable2FAMutation({
    form,
    setTotpURI,
    setBackupCodes,
    dialogTriggerRef,
  });

  const {
    mutate: disable2FA,
    isPending: isDisable2FAPending,
    isError: isDisable2FAError,
  } = useDisable2FAMutation({
    form,
  });

  function onSubmit(values: Toggle2FAFormValues) {
    if (values.enable2FA)
      return enable2FA({
        password: values.currentPassword,
      });

    if (!values.enable2FA)
      return disable2FA({
        password: values.currentPassword,
      });
  }

  return {
    form,
    onSubmit,
    isPending: isEnable2FAPending || isDisable2FAPending,
    isError: isEnable2FAError || isDisable2FAError,
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
