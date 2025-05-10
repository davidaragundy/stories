import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { RATE_LIMIT_ERROR_CODE } from "@/shared/constants";
import { authClient } from "@/shared/lib/better-auth/client";
import type { AuthClientError } from "@/shared/types";

import type { ResetPasswordFormValues } from "@/features/auth/types";

interface Props {
  token: string;
}

export const useResetPasswordMutation = ({ token }: Props) => {
  const router = useRouter();

  return useMutation({
    mutationFn: async (values: ResetPasswordFormValues) => {
      const { error } = await authClient.resetPassword({
        newPassword: values.password,
        token,
      });

      if (error) {
        throw new Error(error.message, { cause: error });
      }
    },
    onSuccess: () => {
      toast.success("Password reset successfully 🎉", {
        duration: 10000,
        description: "You can now sign in with your new password.",
      });

      router.push("/sign-in");
    },
    onError: (error) => {
      const authClientError = error.cause as AuthClientError;

      if (authClientError.status === RATE_LIMIT_ERROR_CODE) return;

      switch (authClientError.code) {
        case "INVALID_TOKEN":
          toast.error("Invalid token 😢", {
            description: "Please request a new password reset link.",
            duration: 10000,
            action: {
              label: "Request new link",
              onClick: () => router.push("/forgot-password"),
            },
          });
          return;

        default:
          toast.error("Something went wrong, please try again later 😢");
          return;
      }
    },
  });
};
