"use client";

import { deleteCommentAction } from "@/actions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { FullComment } from "@/types";
import { usePageStore } from "@/hooks";

export const useDeleteCommentMutation = () => {
  const { queryKey: pageQueryKey } = usePageStore((state) => state);

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
      await queryClient.cancelQueries({
        queryKey: ["post", postId, "comments"],
      });

      const previousPosts = queryClient.getQueryData<FullComment[]>([
        "post",
        postId,
        "comments",
      ]);

      queryClient.setQueryData(
        ["post", postId, "comments"],
        (old: FullComment[]) => old.filter((c) => c.id !== commentId),
      );

      return { previousPosts };
    },
    onError: (_error, { postId }, context) => {
      queryClient.setQueryData(
        ["post", postId, "comments"],
        context?.previousPosts,
      );
    },
    onSettled: (_data, _error, { postId }) => {
      queryClient.invalidateQueries({ queryKey: ["post", postId, "comments"] });

      queryClient.invalidateQueries({ queryKey: pageQueryKey });
    },
  });

  return mutation;
};
