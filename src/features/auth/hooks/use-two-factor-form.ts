import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { authClient } from "@/shared/lib/auth/client";
import { twoFactorSchema } from "@/shared/schemas";
import { TwoFactorValues } from "@/shared/types";

import { toast } from "sonner";

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

    if (error) {
      setIsLoading(false);

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

    setIsLoading(false);
  };

  return { form, isLoading, onSubmit };
};
