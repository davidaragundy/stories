import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { authClient } from "@/shared/lib/auth/client";

import { signInWithMagicLinkSchema } from "@/features/auth/schemas";
import { MagicLinkValues } from "@/features/auth/types";

import { toast } from "sonner";

export const useMagicLinkForm = () => {
  const form = useForm<MagicLinkValues>({
    resolver: zodResolver(signInWithMagicLinkSchema),
    defaultValues: {
      email: "",
    },
  });

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (values: MagicLinkValues) => {
    setIsLoading(true);

    const { data, error } = await authClient.signIn.magicLink({
      email: values.email,
      callbackURL: "/home",
    });

    setIsLoading(false);

    if (error) {
      if (error.status === 429) return;

      switch (error.code) {
        case "USER_NOT_FOUND":
          form.setError("email", {
            message:
              "Please check your email address or sign up if you don't have an account.",
          });
          return;

        case "FAILED_TO_SEND_MAGIC_LINK":
          toast.error("Failed to send magic link 😢", {
            duration: 10000,
            description: "Try again later or use another method to sign in.",
          });
          return;

        default:
          toast.error("Something went wrong, please try again later 😢");
          return;
      }
    }

    if (data.status) {
      toast.success("Magic link sent successfully 🎉", {
        description: "Check your inbox (or spam folder) for the link.",
        duration: 10000,
      });
    }
  };

  return { form, isLoading, onSubmit };
};
