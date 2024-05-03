"use client";

import { deleteCommentAction } from "@/actions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { FullComment } from "@/types";

export const useDeleteCommentMutation = (queryKey: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({
      commentId,
      postId,
    }: {
      postId: string;
      commentId: string;
    }) => await deleteCommentAction(commentId, postId),
    onMutate: async ({ commentId, postId }) => {
      await queryClient.cancelQueries({ queryKey: ["comments", postId] });

      const previousPosts = queryClient.getQueryData<FullComment[]>([
        "comments",
        postId,
      ]);

      queryClient.setQueryData(["comments", postId], (old: FullComment[]) =>
        old.filter((c) => c.id !== commentId),
      );

      return { previousPosts };
    },
    onError: (_error, { postId }, context) => {
      queryClient.setQueryData(["comments", postId], context?.previousPosts);
    },
    onSettled: (_data, _error, { postId }) => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });

      queryClient.invalidateQueries({ queryKey: [queryKey] });
    },
  });

  return mutation;
};
