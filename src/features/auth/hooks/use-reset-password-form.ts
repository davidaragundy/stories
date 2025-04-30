import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { authClient } from "@/shared/lib/better-auth/client";

import { resetPasswordSchema } from "@/features/auth/schemas/reset-password-schema";
import type { ResetPasswordValues } from "@/features/auth/types";

export const useResetPasswordForm = () => {
  const form = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  const token = searchParams.get("token");

  const onSubmit = async (values: ResetPasswordValues) => {
    router.prefetch("/sign-in");

    setIsLoading(true);

    const { error } = await authClient.resetPassword({
      newPassword: values.password,
      token: token as string,
    });

    setIsLoading(false);

    if (error) {
      if (error.status === 429) return;

      switch (error.code) {
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
    }

    toast.success("Password reset successfully 🎉", {
      duration: 10000,
      description: "You can now sign in with your new password.",
    });

    router.push("/sign-in");
  };

  return {
    form,
    isLoading,
    onSubmit,
  };
};
