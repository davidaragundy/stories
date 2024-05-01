"use client";

import { deletePostAction } from "@/actions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { FullPost } from "@/types";

export const useDeletePostMutation = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (postId: string) => await deletePostAction(postId),
    onMutate: async (postId) => {
      await queryClient.cancelQueries({ queryKey: ["posts"] });

      const previousPosts = queryClient.getQueryData<FullPost[]>(["posts"]);

      queryClient.setQueryData(["posts"], (old: FullPost[]) =>
        old.filter((p) => p.id !== postId),
      );

      return { previousPosts };
    },
    onError: (_error, _newPost, context) => {
      queryClient.setQueryData(["posts"], context?.previousPosts);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  return mutation;
};
