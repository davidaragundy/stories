import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useSession } from "@/shared/hooks/use-session";
import { tryCatch } from "@/shared/utils/try-catch";

import { useChangePasswordMutation } from "@/features/settings/hooks/use-change-password-mutation";
import { changePasswordFormSchema } from "@/features/settings/schemas/change-password-form-schema";
import type { ChangePasswordFormValues } from "@/features/settings/types";

export const useChangePasswordForm = () => {
  const { isSuccess: isSessionSuccess } = useSession();

  const form = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
    },
  });

  const { mutateAsync: changePassword, isPending } = useChangePasswordMutation({
    form,
  });

  async function onSubmit(values: ChangePasswordFormValues) {
    await tryCatch(changePassword(values));
  }

  return {
    form,
    onSubmit,
    isPending,
    isSessionSuccess,
  };
};
