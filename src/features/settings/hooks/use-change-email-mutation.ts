import { useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

import { RATE_LIMIT_ERROR_CODE } from "@/shared/constants";
import { authClient } from "@/shared/lib/better-auth/client";
import { SESSION_QUERY_KEY } from "@/shared/lib/react-query/query-key-factory";
import type { AuthClientError } from "@/shared/types";

import type { ChangeEmailFormValues } from "@/features/settings/types";
interface Props {
  form: UseFormReturn<ChangeEmailFormValues>;
}

export const useChangeEmailMutation = ({ form }: Props) => {
  const queryClient = useQueryClient();
  const toastId = useRef<string | number>("");

  return useMutation({
    mutationFn: async (values: ChangeEmailFormValues) => {
      const { error } = await authClient.changeEmail({
        newEmail: values.email,
        callbackURL: "/settings/account",
      });

      if (error) {
        throw new Error(error.message, { cause: error });
      }
    },
    onMutate: () => {
      toastId.current = toast.loading("Changing email...");
    },
    onSuccess: () => {
      toast.success("Change email verification 💂", {
        id: toastId.current,
        description:
          "We sent a confirmation to your old email address. Please check your inbox (or spam folder) to approve the changes in order to update it.",
        duration: 20_000,
      });
    },
    onError: (error) => {
      const authClientError = error.cause as AuthClientError;

      if (authClientError.status === RATE_LIMIT_ERROR_CODE) return;

      switch (authClientError.code) {
        case "USER_ALREADY_EXISTS":
          form.setError("email", {
            message: "A user with that email already exists",
          });
          return;

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
