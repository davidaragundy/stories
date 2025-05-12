import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useSignUpEmailMutation } from "@/features/auth/hooks/use-sign-up-email-mutation";
import { useSignUpSocialMutation } from "@/features/auth/hooks/use-sign-up-social-mutation";
import { signUpFormSchema } from "@/features/auth/schemas/sign-up-form-schema";
import type { SignUpFormValues } from "@/features/auth/types";

export const useSignUpForm = () => {
  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
    },
  });

  const { mutate: signUpWithEmail, isPending: isSigningUpWithEmail } =
    useSignUpEmailMutation({
      form,
    });

  const { mutate: signUpWithSocial, isPending: isSigningUpWithSocial } =
    useSignUpSocialMutation();

  const onSubmit = (values: SignUpFormValues) => signUpWithEmail(values);

  const handleSignUpWithSocial = (provider: "google" | "github") =>
    signUpWithSocial({ provider });

  const handleSignUpWithGithub = () => handleSignUpWithSocial("github");

  const handleSignUpWithGoogle = () => handleSignUpWithSocial("google");

  return {
    form,
    onSubmit,
    isPending: isSigningUpWithEmail || isSigningUpWithSocial,
    handleSignUpWithGithub,
    handleSignUpWithGoogle,
  };
};
