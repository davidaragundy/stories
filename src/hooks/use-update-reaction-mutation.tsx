"use client";

import { updateReactionAction } from "@/actions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { FullPost, Reaction } from "@/types";

export const useUpdateReactionMutation = (queryKey: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({
      target,
      targetId,
      reaction,
    }: {
      target: "post" | "comment";
      targetId: string;
      reaction: Reaction;
      userId: string;
    }) => await updateReactionAction(target, targetId, reaction),
    onMutate: async ({ target, targetId, reaction, userId }) => {
      await queryClient.cancelQueries({
        queryKey: [target === "post" ? queryKey : "comments"],
      });

      const previousPosts = queryClient.getQueryData<FullPost[]>([
        target === "post" ? queryKey : "comments",
      ]);

      queryClient.setQueryData(
        [target === "post" ? queryKey : "comments"],
        (old: FullPost[]) =>
          old.map((post) => {
            if (post.id === targetId) {
              const reactionIndex = post.reactions.findIndex(
                (reactionItem) =>
                  reactionItem.userId === userId &&
                  reactionItem.type === reaction,
              );

              const liked = reactionIndex !== -1;

              if (liked) {
                post.reactions.splice(reactionIndex, 1);
              } else {
                post.reactions.push({ userId, type: reaction });
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
    onError: (_error, { target }, context) => {
      queryClient.setQueryData(
        [target === "post" ? queryKey : "comments"],
        context?.previousPosts,
      );
    },
    onSettled: (_data, _error, { target, reaction, targetId }) => {
      queryClient.invalidateQueries({
        queryKey: [target === "post" ? queryKey : "comments"],
      });

      queryClient.invalidateQueries({
        queryKey: ["reactions", reaction, targetId],
      });
    },
  });

  return mutation;
};
