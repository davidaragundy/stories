"use client";

import { updatePostReactionAction } from "@/actions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { FullPost, Reaction } from "@/types";
import { usePageState, usePostState } from "@/hooks";

export const useUpdatePostReactionMutation = () => {
  const { posts, user } = usePageState();
  const { id } = usePostState();

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (reaction: Reaction) =>
      await updatePostReactionAction({ postId: id, reaction }),
    onMutate: async (reaction) => {
      await queryClient.cancelQueries({
        queryKey: posts!.queryKey,
      });

      const previousPosts = queryClient.getQueryData<FullPost[]>(
        posts!.queryKey,
      );

      queryClient.setQueryData(posts!.queryKey, (old: FullPost[]) =>
        old.map((post) => {
          if (post.id === id) {
            const reactionIndex = post.reactions.findIndex(
              (reactionItem) =>
                reactionItem.userId === user!.id &&
                reactionItem.type === reaction,
            );

            const liked = reactionIndex > -1;

            if (liked) {
              post.reactions.splice(reactionIndex, 1);
            } else {
              post.reactions.push({ userId: user!.id, type: reaction });
            }

            return {
              ...post,
              [`${reaction}Count`]: liked
                ? post[`${reaction}Count`] - 1
                : post[`${reaction}Count`] + 1,
            };
          }

          return post;
        }),
      );

      return { previousPosts };
    },
    onError: (_error, _reaction, context) => {
      queryClient.setQueryData(posts!.queryKey, context?.previousPosts);
    },
    onSettled: (_data, _error, reaction) => {
      queryClient.invalidateQueries({
        queryKey: posts!.queryKey,
      });

      queryClient.invalidateQueries({
        queryKey: ["post", id, "reactions", reaction],
      });
    },
  });

  return mutation;
};
