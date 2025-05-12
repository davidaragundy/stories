import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { useRecoveryMutation } from "@/features/auth/hooks/use-recovery-mutation";
import { recoveryFormSchema } from "@/features/auth/schemas/recovery-form-schema";
import type { RecoveryFormValues } from "@/features/auth/types";

export const useRecoveryForm = () => {
  const form = useForm<RecoveryFormValues>({
    resolver: zodResolver(recoveryFormSchema),
    defaultValues: {
      code: "",
    },
  });

  const { mutate, isPending } = useRecoveryMutation({ form });

  const onSubmit = async (values: RecoveryFormValues) => mutate(values);

  return { form, onSubmit, isPending };
};
