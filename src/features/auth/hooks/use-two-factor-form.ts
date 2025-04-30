import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { authClient } from "@/shared/lib/better-auth/client";
import { twoFactorSchema } from "@/shared/schemas/two-factor-schema";
import type { TwoFactorValues } from "@/shared/types";

export const useTwoFactorForm = () => {
  const form = useForm<TwoFactorValues>({
    resolver: zodResolver(twoFactorSchema),
    defaultValues: {
      code: "",
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async (values: TwoFactorValues) => {
    setIsLoading(true);

    const { error } = await authClient.twoFactor.verifyTotp({
      code: values.code,
    });

    setIsLoading(false);

    if (error) {
      if (error.status === 429) return;

      switch (error.code) {
        case "INVALID_TWO_FACTOR_AUTHENTICATION":
          form.setError("code", {
            message: "Invalid one-time password",
          });
          return;

        default:
          toast.error("An error occurred, please try again later 😢");
          return;
      }
    }

    router.push("/home");
  };

  return { form, isLoading, onSubmit };
};
