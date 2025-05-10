import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useSession } from "@/shared/hooks/use-session";
import { tryCatch } from "@/shared/utils/try-catch";

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
    defaultValues: {
      email: session?.user.email ?? "",
    },
    values: {
      email: session?.user.email ?? "",
    },
  });

  const { mutateAsync: changeUsername, isPending } = useChangeEmailMutation({
    form,
  });

  const onSubmit = async (values: ChangeEmailFormValues) => {
    await tryCatch(changeUsername(values));
  };

  return {
    form,
    onSubmit,
    isPending,
    isSessionSuccess,
    isSessionLoading,
    isSessionError,
    refetchSession,
    isSessionRefetching,
  };
};
