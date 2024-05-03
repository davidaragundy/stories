"use client";

import { createCommentAction } from "@/actions";
import { CreateCommentInputsServer } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { User } from "lucia";
import type { FullComment } from "@/types";
import { getOptimisticComment } from "@/utils";

export const useCreateCommentMutation = ({
  user,
  queryKey,
}: {
  user: User;
  queryKey: string;
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: CreateCommentInputsServer) =>
      await createCommentAction(data),
    onMutate: async (newComment) => {
      await queryClient.cancelQueries({
        queryKey: ["comments", newComment.postId],
      });

      const previousComments = queryClient.getQueryData<FullComment[]>([
        "comments",
        newComment.postId,
      ]);

      const optimisticComment = getOptimisticComment({
        ...newComment,
        user,
      });

      queryClient.setQueryData(
        ["comments", newComment.postId],
        (old: FullComment[]) => [...old, optimisticComment],
      );

      return { previousComments };
    },
    onError: (_error, newComment, context) => {
      queryClient.setQueryData(
        ["comments", newComment.postId],
        context?.previousComments,
      );
    },
    onSettled: (_data, _error, { postId }) => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });

      queryClient.invalidateQueries({ queryKey: [queryKey] });
    },
  });

  return mutation;
};
