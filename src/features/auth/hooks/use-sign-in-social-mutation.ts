import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { RATE_LIMIT_ERROR_CODE } from "@/shared/constants";
import { authClient } from "@/shared/lib/better-auth/client";
import type { AuthClientError } from "@/shared/types";

export const useSignInSocialMutation = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: async ({ provider }: { provider: "google" | "github" }) => {
      const { data, error } = await authClient.signIn.social({
        provider,
        callbackURL: "/home",
      });

      if (error) throw new Error(error.message, { cause: error });

      return data;
    },
    onSuccess: (data) => {
      if (data?.redirect) router.push(data.url as string);
    },
    onError: (error, { provider }) => {
      const authClientError = error.cause as AuthClientError;

      if (authClientError.status === RATE_LIMIT_ERROR_CODE) return;

      toast.error(`Failed to sign in with ${provider} 😢`);
    },
  });
};
