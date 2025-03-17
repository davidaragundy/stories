import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { authClient } from "@/shared/lib/auth/client";

import { signInWithCredentialsSchema } from "@/features/auth/schemas";
import { CredentialsValues } from "@/features/auth/types";

import { toast } from "sonner";

export const useCredentialsForm = () => {
  const form = useForm<CredentialsValues>({
    resolver: zodResolver(signInWithCredentialsSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async (values: CredentialsValues) => {
    setIsLoading(true);

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

          router.push("/home");
        },
      }
    );

    if (error) {
      setIsLoading(false);

      if (error.status === 429) return;

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
    }

    setIsLoading(false);
  };

  return { form, isLoading, onSubmit };
};
