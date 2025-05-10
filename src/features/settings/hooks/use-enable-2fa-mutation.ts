import { Dispatch, RefObject, SetStateAction, useRef } from "react";
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
  const toastId = useRef<string | number>("");

  return useMutation({
    mutationFn: async ({ password }: { password: string }) => {
      const { data, error } = await authClient.twoFactor.enable({
        password,
      });

      if (error) {
        throw new Error(error.message, { cause: error });
      }

      return data;
    },
    onMutate: async () => {
      toastId.current = toast.loading("Enabling two-factor authentication...");

      // Cancel any outgoing refetch
      // (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: [SESSION_QUERY_KEY] });

      // Snapshot the previous value
      const previousSession = queryClient.getQueryData<Session>([
        SESSION_QUERY_KEY,
      ]);

      // Optimistically update to the new value
      queryClient.setQueryData([SESSION_QUERY_KEY], (old: Session): Session => {
        return {
          session: old.session,
          user: {
            ...old.user,
            twoFactorEnabled: true,
          },
        };
      });

      // Return a context object with the snapshotted value
      return { previousSession };
    },
    onSuccess: (data) => {
      toast.dismiss(toastId.current);

      setTotpURI(data.totpURI);
      setBackupCodes(data.backupCodes);
      dialogTriggerRef.current?.click();

      form.reset();
    },
    // If the mutation fails,
    // use the context returned from onMutate to roll back
    onError: (error, _data, context) => {
      queryClient.setQueryData([SESSION_QUERY_KEY], context?.previousSession);

      const authClientError = error.cause as AuthClientError;

      if (authClientError.status === RATE_LIMIT_ERROR_CODE) return;

      switch (authClientError.code) {
        case "INVALID_PASSWORD":
          form.setError("currentPassword", {
            message: "Invalid password",
          });
          toast.dismiss(toastId.current);
          return;

        default:
          toast.error("Failed to enable 2FA, please try again later 😢", {
            id: toastId.current,
            duration: 10000,
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
