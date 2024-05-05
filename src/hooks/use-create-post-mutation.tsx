"use client";

import { createPostAction } from "@/actions";
import { CreatePostInputsServer } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { FullPost } from "@/types";
import { getOptimisticPost } from "@/utils";
import { usePageStore } from "@/hooks";

export const useCreatePostMutation = () => {
  const { queryKey, user } = usePageStore((state) => state);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: CreatePostInputsServer) =>
      await createPostAction(data),
    onMutate: async (newPost) => {
      await queryClient.cancelQueries({ queryKey });

      const previousPosts = queryClient.getQueryData<FullPost[]>(queryKey);

      const optimisticPost = getOptimisticPost({
        user,
        ...newPost,
      });

      queryClient.setQueryData(queryKey, (old: FullPost[]) => [
        optimisticPost,
        ...old,
      ]);

      return { previousPosts };
    },
    onError: (_error, _newPost, context) => {
      queryClient.setQueryData(queryKey, context?.previousPosts);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  return mutation;
};
