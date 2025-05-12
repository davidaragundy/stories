import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { credentialsFormSchema } from "@/features/auth/schemas/credentials-form-schema";
import type { CredentialsFormValues } from "@/features/auth/types";

import { useCredentialsMutation } from "@/features/auth/hooks/use-credentials-mutation";
import { tryCatch } from "@/shared/utils/try-catch";

export const useCredentialsForm = () => {
  const form = useForm<CredentialsFormValues>({
    resolver: zodResolver(credentialsFormSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const { mutateAsync: signIn, isPending } = useCredentialsMutation({
    form,
  });

  const onSubmit = async (values: CredentialsFormValues) => {
    await tryCatch(signIn(values));
  };

  return { form, onSubmit, isPending };
};
