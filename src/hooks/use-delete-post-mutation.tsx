"use client";

import { deletePostAction } from "@/actions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { FullPost } from "@/types";
import { usePageState } from "@/hooks";

export const useDeletePostMutation = () => {
  const { queryKey } = usePageState();

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (postId: string) => await deletePostAction(postId),
    onMutate: async (postId) => {
      await queryClient.cancelQueries({ queryKey });

      const previousPosts = queryClient.getQueryData<FullPost[]>(queryKey);

      queryClient.setQueryData(queryKey, (old: FullPost[]) =>
        old.filter((p) => p.id !== postId),
      );

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
