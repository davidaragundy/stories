import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { RATE_LIMIT_ERROR_CODE } from "@/shared/constants";
import { authClient } from "@/shared/lib/better-auth/client";
import type { AuthClientError } from "@/shared/types";

export const useSignUpSocialMutation = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: async ({ provider }: { provider: "google" | "github" }) => {
      const { data, error } = await authClient.signIn.social({
        provider,
        callbackURL: "/home",
      });

      if (error) return Promise.reject(error);

      return data;
    },
    onSuccess: (data) => {
      if (data?.redirect) router.push(data.url as string);
    },
    onError: (error: AuthClientError, { provider }) => {
      if (error.status === RATE_LIMIT_ERROR_CODE) return;

      toast.error(`Failed to sign up with ${provider} 😢`);
    },
  });
};
