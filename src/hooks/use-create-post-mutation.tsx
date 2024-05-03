"use client";

import { createPostAction } from "@/actions";
import { CreatePostInputsServer } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { User } from "lucia";
import type { FullPost } from "@/types";
import { getOptimisticPost } from "@/utils";

export const useCreatePostMutation = ({
  user,
  queryKey,
}: {
  user: User;
  queryKey: string;
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: CreatePostInputsServer) =>
      await createPostAction(data),
    onMutate: async (newPost) => {
      await queryClient.cancelQueries({ queryKey: [queryKey] });

      const previousPosts = queryClient.getQueryData<FullPost[]>([queryKey]);

      const optimisticPost = getOptimisticPost({
        user,
        ...newPost,
      });

      queryClient.setQueryData([queryKey], (old: FullPost[]) => [
        optimisticPost,
        ...old,
      ]);

      return { previousPosts };
    },
    onError: (_error, _newPost, context) => {
      queryClient.setQueryData([queryKey], context?.previousPosts);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
    },
  });

  return mutation;
};
