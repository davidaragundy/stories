import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { RATE_LIMIT_ERROR_CODE } from "@/shared/constants";
import { authClient } from "@/shared/lib/better-auth/client";
import type { AuthClientError } from "@/shared/types";

import type { ForgotPasswordFormValues } from "@/features/auth/types";

export const useForgotPasswordMutation = () => {
  return useMutation({
    mutationFn: async (values: ForgotPasswordFormValues) => {
      const { error } = await authClient.forgetPassword({
        email: values.email,
        redirectTo: "/reset-password",
      });

      if (error) {
        throw new Error(error.message, { cause: error });
      }
    },
    onSuccess: () => {
      toast.success("Reset link sent successfully 🎉", {
        description: "Don't forget to check your spam folder.",
      });
    },
    onError: (error) => {
      const authClientError = error.cause as AuthClientError;

      if (authClientError.status === RATE_LIMIT_ERROR_CODE) return;

      switch (authClientError.code) {
        case "FAILED_TO_SEND_RESET_PASSWORD_EMAIL":
          toast.error("Failed to send reset password email 😢", {
            description: "Please try again later",
            duration: 10_000,
          });
          return;

        default:
          toast.error("Something went wrong, please try again later 😢");
          return;
      }
    },
  });
};
