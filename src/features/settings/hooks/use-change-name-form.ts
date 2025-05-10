import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useSession } from "@/shared/hooks/use-session";
import { tryCatch } from "@/shared/utils/try-catch";

import { useChangeNameMutation } from "@/features/settings/hooks/use-change-name-mutation";
import { changeNameFormSchema } from "@/features/settings/schemas/change-name-form-schema";
import type { ChangeNameFormValues } from "@/features/settings/types";

export const useChangeNameForm = () => {
  const {
    data: session,
    isSuccess: isSessionSuccess,
    isLoading: isSessionLoading,
    isError: isSessionError,
    refetch: refetchSession,
    isRefetching: isSessionRefetching,
  } = useSession();

  const form = useForm<ChangeNameFormValues>({
    resolver: zodResolver(changeNameFormSchema),
    defaultValues: {
      name: session?.user.name ?? "",
    },
    values: {
      name: session?.user.name ?? "",
    },
  });

  const { mutateAsync: changeName, isPending } = useChangeNameMutation();

  const onSubmit = async (values: ChangeNameFormValues) => {
    await tryCatch(changeName(values));
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
