import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { authClient } from "@/shared/lib/auth/client";

import { ForgotPasswordValues } from "@/features/auth/types";
import { forgotPasswordSchema } from "@/features/auth/schemas";

import { toast } from "sonner";

export const useForgotPasswordForm = () => {
  const form = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (values: ForgotPasswordValues) => {
    setIsLoading(true);

    const { error } = await authClient.forgetPassword({
      email: values.email,
      redirectTo: "/reset-password",
    });

    setIsLoading(false);

    if (error) return handleSubmitError(error.code!, values.email);

    toast.success("Reset link sent successfully 🎉", {
      description: "Don't forget to check your spam folder.",
    });
  };

  const handleSubmitError = (errorCode: string, email: string) => {
    switch (errorCode) {
      case "FAILED_TO_SEND_RESET_PASSWORD_EMAIL":
        const toastId = toast.error("Failed to send reset password email 😢", {
          duration: 10000,
          action: {
            label: "Resend email",
            onClick: async () => {
              const id = toast.loading("Resending email...");

              const { error } = await authClient.forgetPassword({
                email,
                redirectTo: "/reset-password",
              });

              if (error) {
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
  };

  return {
    form,
    onSubmit,
    isLoading,
    setIsLoading,
  };
};
