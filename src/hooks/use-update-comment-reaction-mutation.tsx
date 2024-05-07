"use client";

// import { updateCommentReactionAction } from "@/actions";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import type { FullPost, Reaction } from "@/types";
// import { usePageState, usePostState, useCommentState } from "@/hooks";

export const useUpdateCommentReactionMutation = () => {
  // const { user } = usePageState();
  // const { id: postId } = usePostState();
  // const { id } = useCommentState();
  // const queryClient = useQueryClient();
  // const mutation = useMutation({
  //   mutationFn: async (reaction: Reaction) =>
  //     await updateCommentReactionAction({ commentId: id, reaction }),
  //   onMutate: async (reaction) => {
  //     await queryClient.cancelQueries({
  //       queryKey: ["post", postId, "comments"],
  //     });
  //     const previousPosts = queryClient.getQueryData<FullPost[]>([
  //       "post",
  //       postId,
  //       "comments",
  //     ]);
  //     queryClient.setQueryData(
  //       ["post", postId, "comments"],
  //       (old: FullPost[]) =>
  //         old.map((post) => {
  //           if (post.id === id) {
  //             const reactionIndex = post.reactions.findIndex(
  //               (reactionItem) =>
  //                 reactionItem.userId === user!.id &&
  //                 reactionItem.type === reaction,
  //             );
  //             const liked = reactionIndex !== -1;
  //             if (liked) {
  //               post.reactions.splice(reactionIndex, 1);
  //             } else {
  //               post.reactions.push({ userId: user!.id, type: reaction });
  //             }
  //             return {
  //               ...post,
  //               [`${reaction}Count`]: liked
  //                 ? post[`${reaction}Count`] - 1
  //                 : post[`${reaction}Count`] + 1,
  //             };
  //           }
  //           return post;
  //         }),
  //     );
  //     return { previousPosts };
  //   },
  //   onError: (_error, _reaction, context) => {
  //     queryClient.setQueryData(
  //       ["post", postId, "comments"],
  //       context?.previousPosts,
  //     );
  //   },
  //   onSettled: (_data, _error, reaction) => {
  //     queryClient.invalidateQueries({
  //       queryKey: ["post", postId, "comments"],
  //     });
  //     queryClient.invalidateQueries({
  //       queryKey: ["comment", id, "reactions", reaction],
  //     });
  //   },
  // });
  // return mutation;
};
