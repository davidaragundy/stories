import { UseFormReturn } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { RATE_LIMIT_ERROR_CODE } from "@/shared/constants";
import { authClient } from "@/shared/lib/better-auth/client";
import type { AuthClientError } from "@/shared/types";

import { getHash } from "@/features/auth/utils/get-hash";
import type { SignUpFormValues } from "@/features/auth/types";

interface Props {
  form: UseFormReturn<SignUpFormValues>;
}

export const useSignUpEmailMutation = ({ form }: Props) => {
  return useMutation({
    mutationFn: async (values: SignUpFormValues) => {
      const hash = await getHash(values.email);
      const image = `https://gravatar.com/avatar/${hash}?size=500&d=robohash&r=x`;

      const { data, error } = await authClient.signUp.email({
        email: values.email,
        password: values.password,
        name: values.name,
        username: values.username,
        displayUsername: values.username,
        image,
        callbackURL: "/home",
      });

      if (error) throw new Error(error.message, { cause: error });

      return data;
    },
    onSuccess: () => {
      toast.success("Account created successfully 🎉", {
        description: "Please check your email to verify your account.",
        duration: 10_000,
      });
    },
    onError: (error, values) => {
      const authClientError = error.cause as AuthClientError;

      if (authClientError.status === RATE_LIMIT_ERROR_CODE) return;

      switch (authClientError.code) {
        case "USERNAME_IS_ALREADY_TAKEN_PLEASE_TRY_ANOTHER":
          form.setError("username", {
            message: "Username is already taken. Please try another.",
          });
          return;

        case "USER_ALREADY_EXISTS":
          form.setError("email", {
            message: "A user with that email already exists",
          });
          return;

        case "PASSWORD_COMPROMISED":
          form.setError("password", {
            message:
              "Password is compromised. Please choose a more secure password.",
          });
          return;

        case "FAILED_TO_SEND_VERIFICATION_EMAIL":
          const toastId = toast.error("Failed to send verification email 😢", {
            duration: 10000,
            action: {
              label: "Resend email",
              onClick: async () => {
                const id = toast.loading("Resending email...");

                const { error } = await authClient.sendVerificationEmail({
                  email: values.email,
                  callbackURL: "/home",
                });

                if (error) {
                  if (error.status === 429) return;

                  toast.dismiss(id);
                  toast.error("Failed to resend email 😢", {
                    id: toastId,
                    duration: 10000,
                  });
                  return;
                }

                toast.success("Email sent successfully 🎉", {
                  description: "Don't forget to check your spam folder.",
                  id,
                });
              },
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
