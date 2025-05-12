import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useSession } from "@/shared/hooks/use-session";

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
    values: {
      name: session?.user.name ?? "",
    },
  });

  const { mutate, isPending, isError } = useChangeNameMutation({ form });

  const { isDirty, isValid } = form.formState;

  const canSubmit =
    isDirty && isValid && form.watch("name").trim() !== session?.user.name;

  const onSubmit = (values: ChangeNameFormValues) => mutate(values);

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
