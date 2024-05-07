"use client";

import { deletePostAction } from "@/actions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { FullPost, ProfileData } from "@/types";
import { usePageState } from "@/hooks";

export const useDeletePostMutation = () => {
  const { posts, info } = usePageState();

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (postId: string) => await deletePostAction(postId),
    onMutate: async (postId) => {
      await queryClient.cancelQueries({ queryKey: posts!.queryKey });

      const previousPosts = queryClient.getQueryData<FullPost[]>(
        posts!.queryKey,
      );

      queryClient.setQueryData(posts!.queryKey, (old: FullPost[]) =>
        old.filter((post) => post.id !== postId),
      );

      if (info)
        queryClient.setQueryData(info.queryKey, (old: ProfileData) => ({
          ...old,
          postsCount: old.postsCount - 1,
        }));

      return { previousPosts };
    },
    onError: (_error, _newPost, context) => {
      queryClient.setQueryData(posts!.queryKey, context?.previousPosts);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: posts!.queryKey });

      if (info) queryClient.invalidateQueries({ queryKey: info.queryKey });
    },
  });

  return mutation;
};
