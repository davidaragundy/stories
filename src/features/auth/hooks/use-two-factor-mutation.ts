import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

import { RATE_LIMIT_ERROR_CODE } from "@/shared/constants";
import { authClient } from "@/shared/lib/better-auth/client";
import type { AuthClientError, TwoFactorFormValues } from "@/shared/types";

interface Props {
  form: UseFormReturn<TwoFactorFormValues>;
}

export const useTwoFactorMutation = ({ form }: Props) => {
  const router = useRouter();

  return useMutation({
    mutationFn: async (values: TwoFactorFormValues) => {
      const { error } = await authClient.twoFactor.verifyTotp({
        code: values.code,
      });

      if (error) return Promise.reject(error);
    },
    onSuccess: () => {
      router.push("/home");
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
          toast.error("An error occurred, please try again later 😢");
          return;
      }
    },
  });
};
