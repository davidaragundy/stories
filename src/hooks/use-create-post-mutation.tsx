"use client";

import { createPostAction } from "@/actions";
import { CreatePostInputsServer } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { FullPost, ProfileData } from "@/types";
import { getOptimisticPost } from "@/utils";
import { usePageState } from "@/hooks";

export const useCreatePostMutation = () => {
  const { posts, user, info } = usePageState();

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: CreatePostInputsServer) =>
      await createPostAction(data),
    onMutate: async (newPost) => {
      await queryClient.cancelQueries({ queryKey: posts!.queryKey });

      const previousPosts = queryClient.getQueryData<FullPost[]>(
        posts!.queryKey,
      );

      const optimisticPost = getOptimisticPost({
        user: user!,
        ...newPost,
      });

      queryClient.setQueryData(posts!.queryKey, (old: FullPost[]) => [
        optimisticPost,
        ...old,
      ]);

      if (info)
        queryClient.setQueryData(info.queryKey, (old: ProfileData) => ({
          ...old,
          postsCount: old.postsCount + 1,
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
