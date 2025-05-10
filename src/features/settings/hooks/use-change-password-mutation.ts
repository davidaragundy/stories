import { useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

import { RATE_LIMIT_ERROR_CODE } from "@/shared/constants";
import { authClient } from "@/shared/lib/better-auth/client";
import { SESSION_QUERY_KEY } from "@/shared/lib/react-query/query-key-factory";
import type { AuthClientError } from "@/shared/types";

import { SESSIONS_QUERY_KEY } from "@/features/settings/lib/react-query/query-keys";
import type { ChangePasswordFormValues } from "@/features/settings/types";

interface Props {
  form: UseFormReturn<ChangePasswordFormValues>;
}

export const useChangePasswordMutation = ({ form }: Props) => {
  const queryClient = useQueryClient();
  const toastId = useRef<string | number>("");

  return useMutation({
    mutationFn: async ({
      currentPassword,
      newPassword,
    }: ChangePasswordFormValues) => {
      const { error } = await authClient.changePassword({
        currentPassword,
        newPassword,
        revokeOtherSessions: true,
      });

      if (error) {
        throw new Error(error.message, { cause: error });
      }
    },
    onMutate: () => {
      toastId.current = toast.loading("Changing password...");
    },
    onSuccess: () => {
      toast.success("Password changed successfully 🎉", {
        id: toastId.current,
      });

      form.reset();
    },
    onError: (error) => {
      const authClientError = error.cause as AuthClientError;

      if (authClientError.status === RATE_LIMIT_ERROR_CODE) return;

      switch (authClientError.code) {
        case "INVALID_PASSWORD":
          form.setError("currentPassword", {
            message: "Invalid password",
          });
          toast.dismiss(toastId.current);
          return;

        case "PASSWORD_COMPROMISED":
          form.setError("newPassword", {
            message:
              "The password you entered has been compromised. Please choose a different password.",
          });
          toast.dismiss(toastId.current);
          return;

        default:
          toast.error("Failed to change password, please try again later 😢", {
            id: toastId.current,
            duration: 10000,
          });
          return;
      }
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: [SESSION_QUERY_KEY] });

      queryClient.invalidateQueries({ queryKey: [SESSIONS_QUERY_KEY] });
    },
  });
};
