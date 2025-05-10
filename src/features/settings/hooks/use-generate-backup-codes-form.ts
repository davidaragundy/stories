import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useSession } from "@/shared/hooks/use-session";
import { tryCatch } from "@/shared/utils/try-catch";

import { useGenerateBackupCodesMutation } from "@/features/settings/hooks/use-generate-backup-codes-mutation";
import { generateBackupCodesFormSchema } from "@/features/settings/schemas/generate-backup-codes-form-schema";
import type { GenerateBackupCodesFormValues } from "@/features/settings/types";

export const useGenerateBackupCodesForm = () => {
  const { data: session } = useSession();

  const form = useForm<GenerateBackupCodesFormValues>({
    resolver: zodResolver(generateBackupCodesFormSchema),
    defaultValues: {
      generateBackupCodes: false,
      currentPassword: "",
    },
  });

  const { mutateAsync: generateBackupCodes, isPending } =
    useGenerateBackupCodesMutation({ form });

  async function onSubmit(values: GenerateBackupCodesFormValues) {
    await tryCatch(
      generateBackupCodes({
        password: values.currentPassword,
      })
    );
  }

  return {
    form,
    onSubmit,
    isPending,
    isTwoFactorEnabled: !!session?.user.twoFactorEnabled,
  };
};
