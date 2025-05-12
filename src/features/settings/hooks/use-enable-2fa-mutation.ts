import { Dispatch, RefObject, SetStateAction } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

import { RATE_LIMIT_ERROR_CODE } from "@/shared/constants";
import { authClient } from "@/shared/lib/better-auth/client";
import { SESSION_QUERY_KEY } from "@/shared/lib/react-query/query-key-factory";
import type { AuthClientError, Session } from "@/shared/types";

import type { Toggle2FAFormValues } from "@/features/settings/types";

interface Props {
  form: UseFormReturn<Toggle2FAFormValues>;
  setTotpURI: Dispatch<SetStateAction<string>>;
  setBackupCodes: Dispatch<SetStateAction<string[]>>;
  dialogTriggerRef: RefObject<HTMLButtonElement | null>;
}

export const useEnable2FAMutation = ({
  form,
  dialogTriggerRef,
  setBackupCodes,
  setTotpURI,
}: Props) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ password }: { password: string }) => {
      const { data, error } = await authClient.twoFactor.enable({
        password,
      });

      if (error) return Promise.reject(error);

      return data;
    },
    onSuccess: (data) => {
      setTotpURI(data.totpURI);
      setBackupCodes(data.backupCodes);
      dialogTriggerRef.current?.click();

      queryClient.setQueryData([SESSION_QUERY_KEY], (old: Session): Session => {
        return {
          session: old.session,
          user: { ...old.user, twoFactorEnabled: true },
        };
      });

      form.reset({ enable2FA: true });
    },
    onError: (error: AuthClientError) => {
      if (error.status === RATE_LIMIT_ERROR_CODE) return;

      switch (error.code) {
        case "INVALID_PASSWORD":
          form.setError("currentPassword", {
            message: "Invalid password",
          });
          return;

        default:
          toast.error("Failed to enable 2FA, please try again later 😢", {
            duration: 10_000,
          });
          return;
      }
    },
    // Always refetch after error or success, but
    // in this case we will do it after verifying the TOTP
    // because the session will be updated AFTER the TOTP is verified
    // onSettled: () =>
    //   Promise.all([
    //     queryClient.invalidateQueries({ queryKey: [SESSION_QUERY_KEY] }),
    //     queryClient.invalidateQueries({ queryKey: ["sessions"] }),
    //   ]),
  });
};
