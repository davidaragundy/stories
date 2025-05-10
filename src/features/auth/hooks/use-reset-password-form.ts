import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useResetPasswordMutation } from "@/features/auth/hooks/use-reset-password-mutation";
import { resetPasswordFormSchema } from "@/features/auth/schemas/reset-password-form-schema";
import type { ResetPasswordFormValues } from "@/features/auth/types";

export const useResetPasswordForm = () => {
  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordFormSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const searchParams = useSearchParams();

  const token = searchParams.get("token")!;

  const { mutate, isPending } = useResetPasswordMutation({ token });

  const onSubmit = async (values: ResetPasswordFormValues) => mutate(values);

  return {
    form,
    onSubmit,
    isPending,
  };
};
