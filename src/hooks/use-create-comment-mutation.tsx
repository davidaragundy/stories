"use client";

import { createCommentAction } from "@/actions";
import { CreateCommentInputsServer } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { FullComment } from "@/types";
import { getOptimisticComment } from "@/utils";
import { usePageStore } from "@/hooks";

export const useCreateCommentMutation = () => {
  const { user, queryKey: pageQueryKey } = usePageStore((state) => state);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: CreateCommentInputsServer) =>
      await createCommentAction(data),
    onMutate: async (newComment) => {
      await queryClient.cancelQueries({
        queryKey: ["post", newComment.postId, "comments"],
      });

      const previousComments = queryClient.getQueryData<FullComment[]>([
        "post",
        newComment.postId,
        "comments",
      ]);

      const optimisticComment = getOptimisticComment({
        ...newComment,
        user,
      });

      queryClient.setQueryData(
        ["post", newComment.postId, "comments"],
        (old: FullComment[]) => [...old, optimisticComment],
      );

      return { previousComments };
    },
    onError: (_error, newComment, context) => {
      queryClient.setQueryData(
        ["post", newComment.postId, "comments"],
        context?.previousComments,
      );
    },
    onSettled: (_data, _error, newComment) => {
      queryClient.invalidateQueries({
        queryKey: ["post", newComment.postId, "comments"],
      });

      queryClient.invalidateQueries({ queryKey: pageQueryKey });
    },
  });

  return mutation;
};
