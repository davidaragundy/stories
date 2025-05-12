import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useSession } from "@/shared/hooks/use-session";

import { useChangePasswordMutation } from "@/features/settings/hooks/use-change-password-mutation";
import { changePasswordFormSchema } from "@/features/settings/schemas/change-password-form-schema";
import type { ChangePasswordFormValues } from "@/features/settings/types";

export const useChangePasswordForm = () => {
  const { isSuccess: isSessionSuccess } = useSession();

  const form = useForm<ChangePasswordFormValues>({
    mode: "onChange",
    resolver: zodResolver(changePasswordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
    },
  });

  const { mutate, isPending, isError } = useChangePasswordMutation({
    form,
  });

  const onSubmit = (values: ChangePasswordFormValues) => mutate(values);

  return {
    form,
    onSubmit,
    isPending,
    isError,
    isSessionSuccess,
  };
};
