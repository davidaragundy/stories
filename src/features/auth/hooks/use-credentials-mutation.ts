import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

import { RATE_LIMIT_ERROR_CODE } from "@/shared/constants";
import { authClient } from "@/shared/lib/better-auth/client";
import type { AuthClientError } from "@/shared/types";

import type { CredentialsFormValues } from "@/features/auth/types";

interface Props {
  form: UseFormReturn<CredentialsFormValues>;
}

export const useCredentialsMutation = ({ form }: Props) => {
  const router = useRouter();

  return useMutation({
    mutationFn: async (values: CredentialsFormValues) => {
      const { error } = await authClient.signIn.username(
        {
          username: values.username,
          password: values.password,
        },
        {
          async onSuccess(context) {
            if (context.data.twoFactorRedirect) {
              return router.push("/2fa");
            }

            return router.push("/home");
          },
        }
      );

      if (error) return Promise.reject(error);
    },
    onError: (error: AuthClientError) => {
      if (error.status === RATE_LIMIT_ERROR_CODE) return;

      switch (error.code) {
        case "INVALID_USERNAME_OR_PASSWORD":
          form.setError("username", {
            message: "Invalid username or password.",
          });
          form.setError("password", {
            message: "Invalid username or password.",
          });
          return;

        case "EMAIL_NOT_VERIFIED":
          toast.error("Verify your email to sign in 📧", {
            description:
              "Check your inbox (or spam folder) for the verification email.",
            duration: 10000,
          });
          return;

        default:
          toast.error("Something went wrong, please try again later 😢");
          return;
      }
    },
  });
};
