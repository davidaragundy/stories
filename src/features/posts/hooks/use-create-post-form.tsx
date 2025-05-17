"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { createPostFormSchema } from "@/features/posts/schemas/create-post-form-schema";
import { useCreatePostMutation } from "@/features/posts/hooks/use-create-post-mutation";
// import type { CreatePostFormValues } from "@/features/posts/types";

export const useCreatePostForm = () => {
  const form = useForm({
    resolver: zodResolver(createPostFormSchema.pick({ content: true })),
    defaultValues: {
      content: "",
    },
  });

  const { mutate, isPending, isError } = useCreatePostMutation();

  const onSubmit = (values: { content: string }) =>
    mutate(values.content, {
      onSuccess: () => {
        form.reset();
      },
    });

  return {
    form,
    onSubmit,
    isPending,
    isError,
  };
};
