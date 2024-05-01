"use client";

import { createPostAction } from "@/actions";
import { CreatePostInputsServer } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { User } from "lucia";
import type { FullPost } from "@/types";
import { getOptimisticPost } from "@/utils";

export const useCreatePostMutation = ({ user }: { user: User }) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: CreatePostInputsServer) =>
      await createPostAction(data),
    onMutate: async (newPost) => {
      await queryClient.cancelQueries({ queryKey: ["posts"] });

      const previousPosts = queryClient.getQueryData<FullPost[]>(["posts"]);

      const optimisticPost = getOptimisticPost({
        user,
        ...newPost,
      });

      queryClient.setQueryData(["posts"], (old: FullPost[]) => [
        optimisticPost,
        ...old,
      ]);

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
