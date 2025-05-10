import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { magicLinkFormSchema } from "@/features/auth/schemas/magic-link-form-schema";
import { useMagicLinkMutation } from "@/features/auth/hooks/use-magic-link-mutation";
import type { MagicLinkFormValues } from "@/features/auth/types";

export const useMagicLinkForm = () => {
  const form = useForm<MagicLinkFormValues>({
    resolver: zodResolver(magicLinkFormSchema),
    defaultValues: {
      email: "",
    },
  });

  const { mutate, isPending } = useMagicLinkMutation({ form });

  const onSubmit = async (values: MagicLinkFormValues) => mutate(values);

  return { form, onSubmit, isPending };
};
