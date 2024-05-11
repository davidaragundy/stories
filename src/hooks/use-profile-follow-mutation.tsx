"use client";

import { followAction } from "@/actions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Follows, ProfileData } from "@/types";
import { usePageState } from "@/hooks";

export const useProfileFollowMutation = () => {
  const { user, profile, info } = usePageState();

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (userId: string) => await followAction(userId),
    onMutate: async (userId) => {
      await queryClient.cancelQueries({
        queryKey: info!.queryKey,
      });

      const previousData = queryClient.getQueryData<ProfileData>(
        info!.queryKey,
      );

      queryClient.setQueryData(info!.queryKey, (old: ProfileData) => {
        const isAlreadyFollowing =
          old.followers.findIndex((follow) => follow.followerId === user!.id) >
          -1;

        return {
          ...old,
          followersCount: isAlreadyFollowing
            ? old.followersCount - 1
            : old.followersCount + 1,
          followers: isAlreadyFollowing
            ? old.followers.filter((follow) => follow.followerId != user!.id)
            : [
                ...old.followers,
                {
                  followerId: user!.id,
                  followingId: userId,
                  createdAt: Date.now(),
                } satisfies Follows,
              ],
        };
      });

      return { previousData };
    },
    onError: (_error, _variables, context) => {
      queryClient.setQueryData(info!.queryKey, context?.previousData);
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: info!.queryKey,
      });

      queryClient.invalidateQueries({
        queryKey: ["profile", profile?.username, "info", "followers"],
      });

      queryClient.invalidateQueries({
        queryKey: ["profile", user!.username, "info"],
      });

      queryClient.invalidateQueries({
        queryKey: ["profile", user!.username, "info", "following"],
      });

      queryClient.invalidateQueries({
        queryKey: ["following", "posts"],
      });
    },
  });

  return mutation;
};
