"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { authClient } from "@/shared/lib/auth/client";

import { MagicLinkForm, CredentialsForm } from "@/features/auth/components";

import { IdCardIcon, WandSparklesIcon } from "lucide-react";
import { toast } from "sonner";

export const useSignInForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [signInMethod, setSignInMethod] = useState<"credentials" | "magicLink">(
    "credentials"
  );

  const router = useRouter();

  const handleSignInWithGitHub = async () => {
    setIsLoading(true);

    const { data, error } = await authClient.signIn.social({
      provider: "github",
      callbackURL: "/home",
    });

    if (error) {
      if (error.status !== 429) toast.error("Failed to sign in with GitHub 😢");
    }

    if (data?.redirect) router.push(data?.url as string);

    setIsLoading(false);
  };

  const toggleSignInMethod = () =>
    setSignInMethod(
      signInMethod === "credentials" ? "magicLink" : "credentials"
    );

  const form =
    signInMethod === "credentials" ? <CredentialsForm /> : <MagicLinkForm />;

  const toggleSignInMethodButtonContent =
    signInMethod === "credentials" ? (
      <>
        <WandSparklesIcon /> Sign in with Magic Link
      </>
    ) : (
      <>
        <IdCardIcon />
        Sign in with Credentials
      </>
    );

  return {
    form,
    isLoading,
    setIsLoading,
    signInMethod,
    setSignInMethod,
    toggleSignInMethod,
    toggleSignInMethodButtonContent,
    handleSignInWithGitHub,
  };
};
