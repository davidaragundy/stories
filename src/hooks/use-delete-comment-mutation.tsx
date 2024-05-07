"use client";

import { deleteCommentAction } from "@/actions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { FullComment, FullPost } from "@/types";
import { usePageState } from "@/hooks";

interface MutationProps {
  postId: string;
  commentId: string;
}

export const useDeleteCommentMutation = () => {
  const { posts } = usePageState();

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: MutationProps) =>
      await deleteCommentAction({ ...data }),
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
        (old: FullComment[]) =>
          old.filter((comment) => comment.id !== commentId),
      );

      queryClient.setQueryData(posts!.queryKey, (old: FullPost[]) =>
        old.map((post) => {
          if (post.id === postId) {
            return {
              ...post,
              commentsCount: post.commentsCount - 1,
            };
          }

          return post;
        }),
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

      queryClient.invalidateQueries({ queryKey: posts!.queryKey });
    },
  });

  return mutation;
};
