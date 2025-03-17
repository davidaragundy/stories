import { useRouter } from "next/navigation";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { authClient } from "@/shared/lib/auth/client";

import { recoverySchema } from "@/features/auth/schemas";
import { RecoveryValues } from "@/features/auth/types";
import { toast } from "sonner";

export const useRecoveryForm = () => {
  const form = useForm<RecoveryValues>({
    resolver: zodResolver(recoverySchema),
    defaultValues: {
      code: "",
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async (values: RecoveryValues) => {
    setIsLoading(true);

    const { error } = await authClient.twoFactor.verifyBackupCode({
      code: values.code,
    });

    setIsLoading(false);

    if (error) {
      if (error.status === 429) return;

      switch (error.code) {
        case "INVALID_BACKUP_CODE":
          form.setError("code", {
            message: "Invalid code",
          });
          return;

        default:
          toast.error("Something went wrong, please try again later 😢");
          return;
      }
    }

    toast.info(
      "Please note that each recovery code can only be used once. If you have used all your recovery codes, you can generate new ones in your account settings. If you don't remember your password, this is a good time to reset it.",
      {
        dismissible: false,
        closeButton: true,
        duration: 20_000,
        action: {
          label: "Go to settings",
          onClick: () => router.push("/settings"),
        },
      }
    );

    router.push("/home");
  };

  return { form, isLoading, onSubmit };
};
