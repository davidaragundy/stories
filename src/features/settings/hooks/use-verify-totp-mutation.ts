import { Dispatch, SetStateAction } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

import { RATE_LIMIT_ERROR_CODE } from "@/shared/constants";
import { authClient } from "@/shared/lib/better-auth/client";
import { SESSION_QUERY_KEY } from "@/shared/lib/react-query/query-key-factory";
import type { AuthClientError, TwoFactorFormValues } from "@/shared/types";

import { SESSIONS_QUERY_KEY } from "@/features/settings/lib/react-query/query-keys";

interface Props {
  form: UseFormReturn<TwoFactorFormValues>;
  setTotpURI: Dispatch<SetStateAction<string>>;
  setShowBackupCodes: Dispatch<SetStateAction<boolean>>;
}

export const useVerifyTotpMutation = ({
  form,
  setTotpURI,
  setShowBackupCodes,
}: Props) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ code }: { code: string }) => {
      const { error } = await authClient.twoFactor.verifyTotp({
        code,
      });

      if (error) return Promise.reject(error);
    },
    onSuccess: () => {
      toast.success("Two-factor authentication enabled successfully 🎉", {
        duration: 10_000,
      });

      form.reset();
      setTotpURI("");
      setShowBackupCodes(true);
    },
    onError: (error: AuthClientError) => {
      if (error.status === RATE_LIMIT_ERROR_CODE) return;

      switch (error.code) {
        case "INVALID_TWO_FACTOR_AUTHENTICATION":
          form.setError("code", {
            message: "Invalid one-time password",
          });
          return;

        default:
          toast.error("An error occurred 😢", {
            description: "Please try again later",
            duration: 10_000,
          });
          return;
      }
    },
    onSettled: () => {
      Promise.all([
        queryClient.invalidateQueries({ queryKey: [SESSION_QUERY_KEY] }),
        queryClient.invalidateQueries({ queryKey: [SESSIONS_QUERY_KEY] }),
      ]);
    },
  });
};
