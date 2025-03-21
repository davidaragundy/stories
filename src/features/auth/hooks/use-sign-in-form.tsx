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

  const handleSignInWithSocial = async (provider: "google" | "github") => {
    setIsLoading(true);

    const { data, error } = await authClient.signIn.social({
      provider,
      callbackURL: "/home",
    });

    if (error && error.status !== 429)
      toast.error(`Failed to sign in with ${provider} 😢`);

    if (data?.redirect) router.push(data.url as string);

    setIsLoading(false);
  };

  const handleSignInWithGitHub = () => handleSignInWithSocial("github");

  const handleSignInWithGoogle = () => handleSignInWithSocial("google");

  const toggleSignInMethod = () =>
    setSignInMethod(
      signInMethod === "credentials" ? "magicLink" : "credentials"
    );

  const form =
    signInMethod === "credentials" ? <CredentialsForm /> : <MagicLinkForm />;

  const toggleSignInMethodButtonContent =
    signInMethod === "credentials" ? (
      <>
        <WandSparklesIcon /> Magic Link
      </>
    ) : (
      <>
        <IdCardIcon /> Credentials
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
    handleSignInWithGoogle,
  };
};
