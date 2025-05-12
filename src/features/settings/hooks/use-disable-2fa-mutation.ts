import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

import { RATE_LIMIT_ERROR_CODE } from "@/shared/constants";
import { authClient } from "@/shared/lib/better-auth/client";
import { SESSION_QUERY_KEY } from "@/shared/lib/react-query/query-key-factory";
import type { AuthClientError, Session } from "@/shared/types";

import { SESSIONS_QUERY_KEY } from "@/features/settings/lib/react-query/query-keys";
import type { Toggle2FAFormValues } from "@/features/settings/types";

interface Props {
  form: UseFormReturn<Toggle2FAFormValues>;
}

export const useDisable2FAMutation = ({ form }: Props) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ password }: { password: string }) => {
      const { error } = await authClient.twoFactor.disable({
        password,
      });

      if (error) return Promise.reject(error);
    },
    onSuccess: () => {
      toast.success("2FA has been disabled successfully 🎉", {
        duration: 10_000,
      });

      queryClient.setQueryData([SESSION_QUERY_KEY], (old: Session): Session => {
        return {
          session: old.session,
          user: { ...old.user, twoFactorEnabled: false },
        };
      });

      form.reset({ enable2FA: false });
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
          toast.error("Failed to disable 2FA 😢", {
            description: "Please try again later",
            duration: 10_000,
          });
          return;
      }
    },
    // We do both in this case because not doing so
    // will cause the session to be out of sync with the sessions queries
    onSettled: () => {
      Promise.all([
        queryClient.invalidateQueries({ queryKey: [SESSION_QUERY_KEY] }),
        queryClient.invalidateQueries({ queryKey: [SESSIONS_QUERY_KEY] }),
      ]);
    },
  });
};
