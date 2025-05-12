"use client";

import { useState } from "react";
import { IdCardIcon, WandSparklesIcon } from "lucide-react";

import { CredentialsForm } from "@/features/auth/components/credentials-form";
import { MagicLinkForm } from "@/features/auth/components/magic-link-form";
import { useSignInSocialMutation } from "@/features/auth/hooks/use-sign-in-social-mutation";

export const useSignInForm = () => {
  const [signInMethod, setSignInMethod] = useState<"credentials" | "magicLink">(
    "credentials"
  );

  const { mutate, isPending } = useSignInSocialMutation();

  const handleSignInWithSocial = (provider: "google" | "github") =>
    mutate({ provider });

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
    isPending,
    signInMethod,
    setSignInMethod,
    toggleSignInMethod,
    toggleSignInMethodButtonContent,
    handleSignInWithGitHub,
    handleSignInWithGoogle,
  };
};
