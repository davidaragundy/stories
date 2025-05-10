import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useSession } from "@/shared/hooks/use-session";
import { tryCatch } from "@/shared/utils/try-catch";

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
    defaultValues: {
      username: session?.user.displayUsername ?? "",
    },
    values: {
      username: session?.user.displayUsername ?? "",
    },
  });

  const { mutateAsync: changeUsername, isPending } = useChangeUsernameMutation({
    form,
  });

  const onSubmit = async (values: ChangeUsernameFormValues) => {
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
