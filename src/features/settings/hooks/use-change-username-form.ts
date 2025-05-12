import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useSession } from "@/shared/hooks/use-session";

import { useChangeUsernameMutation } from "@/features/settings/hooks/use-change-username-mutation";
import { changeUsernameFormSchema } from "@/features/settings/schemas/change-username-form-schema";
import type { ChangeUsernameFormValues } from "@/features/settings/types";

export const useChangeUsernameForm = () => {
  const {
    data: session,
    isSuccess: isSessionSuccess,
    isLoading: isSessionLoading,
    isError: isSessionError,
    refetch: refetchSession,
    isRefetching: isSessionRefetching,
  } = useSession();

  const form = useForm<ChangeUsernameFormValues>({
    resolver: zodResolver(changeUsernameFormSchema),
    values: {
      username: session?.user.displayUsername ?? "",
    },
  });

  const { mutate, isPending, isError } = useChangeUsernameMutation({
    form,
  });

  const { isDirty, isValid } = form.formState;

  const canSubmit =
    isDirty &&
    isValid &&
    form.watch("username").trim() !== session?.user.displayUsername;

  const onSubmit = (values: ChangeUsernameFormValues) => mutate(values);

  return {
    form,
    canSubmit,
    onSubmit,
    isPending,
    isError,
    session,
    isSessionSuccess,
    isSessionLoading,
    isSessionError,
    refetchSession,
    isSessionRefetching,
  };
};
