import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { authClient } from "@/shared/lib/better-auth/client";

import { signUpSchema } from "@/features/auth/schemas/sign-up-schema";
import type { SignUpValues } from "@/features/auth/types";
import { getHash } from "@/features/auth/utils/get-hash";

export const useSignUpForm = () => {
  const form = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
    },
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignUpWithSocial = async (provider: "google" | "github") => {
    setIsLoading(true);

    const { data, error } = await authClient.signIn.social({
      provider,
      callbackURL: "/home",
    });

    if (error) {
      if (error.status !== 429)
        toast.error(`Failed to sign up with ${provider} 😢`);
    }

    if (data?.redirect) router.push(data.url as string);

    setIsLoading(false);
  };

  const handleSignUpWithGithub = () => handleSignUpWithSocial("github");

  const handleSignUpWithGoogle = () => handleSignUpWithSocial("google");

  const onSubmit = async (values: SignUpValues) => {
    const hash = await getHash(values.email);
    const image = `https://gravatar.com/avatar/${hash}?size=500&d=robohash&r=x`;

    setIsLoading(true);

    const { data, error } = await authClient.signUp.email({
      email: values.email,
      password: values.password,
      name: values.name,
      username: values.username,
      displayUsername: values.username,
      image,
      callbackURL: "/home",
    });

    setIsLoading(false);

    if (error) {
      if (error.status === 429) return;

      switch (error.code) {
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
    }

    if (data)
      toast.success("Account created successfully 🎉", {
        description: "Please check your email to verify your account.",
        duration: 10000,
      });
  };

  return {
    form,
    isLoading,
    onSubmit,
    handleSignUpWithGithub,
    handleSignUpWithGoogle,
  };
};
