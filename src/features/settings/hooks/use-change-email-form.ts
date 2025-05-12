import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useSession } from "@/shared/hooks/use-session";

import { useChangeEmailMutation } from "@/features/settings/hooks/use-change-email-mutation";
import { changeEmailFormSchema } from "@/features/settings/schemas/change-email-form-schema";
import type { ChangeEmailFormValues } from "@/features/settings/types";

export const useChangeEmailForm = () => {
  const {
    data: session,
    isSuccess: isSessionSuccess,
    isLoading: isSessionLoading,
    isError: isSessionError,
    refetch: refetchSession,
    isRefetching: isSessionRefetching,
  } = useSession();

  const form = useForm<ChangeEmailFormValues>({
    resolver: zodResolver(changeEmailFormSchema),
    values: {
      email: session?.user.email ?? "",
    },
  });

  const { mutate, isPending, isError } = useChangeEmailMutation({
    form,
  });

  const { isDirty, isValid } = form.formState;

  const canSubmit =
    isDirty && isValid && form.watch("email").trim() !== session?.user.email;

  const onSubmit = (values: ChangeEmailFormValues) => mutate(values);

  return {
    form,
    canSubmit,
    onSubmit,
    isPending,
    isError,
    isSessionSuccess,
    isSessionLoading,
    isSessionError,
    refetchSession,
    isSessionRefetching,
  };
};
