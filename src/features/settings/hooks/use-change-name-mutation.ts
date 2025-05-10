import { useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { RATE_LIMIT_ERROR_CODE } from "@/shared/constants";
import { authClient } from "@/shared/lib/better-auth/client";
import { SESSION_QUERY_KEY } from "@/shared/lib/react-query/query-key-factory";
import type { AuthClientError } from "@/shared/types";

import type { ChangeNameFormValues } from "@/features/settings/types";

export const useChangeNameMutation = () => {
  const queryClient = useQueryClient();
  const toastId = useRef<string | number>("");

  return useMutation({
    mutationFn: async (values: ChangeNameFormValues) => {
      const { error } = await authClient.updateUser({
        name: values.name,
      });

      if (error) {
        throw new Error(error.message, { cause: error });
      }
    },
    onMutate: () => {
      toastId.current = toast.loading("Changing name...");
    },
    onSuccess: () => {
      toast.success("Name updated successfully 🎉", {
        id: toastId.current,
        duration: 5_000,
      });
    },
    onError: (error) => {
      const authClientError = error.cause as AuthClientError;

      if (authClientError.status === RATE_LIMIT_ERROR_CODE) return;

      switch (authClientError.code) {
        default:
          toast.error("Something went wrong, please try again later 😢");
          return;
      }
    },
    onSettled: () =>
      queryClient.invalidateQueries({
        queryKey: [SESSION_QUERY_KEY],
      }),
  });
};
